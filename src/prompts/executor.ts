import { z } from 'zod';
import { createHash } from 'crypto';
import { getProvider } from './providers';
import { AICache } from './cache';
import { getTaskConfig, calculateCost, CACHE_TTL_SECONDS, COT_FORMAT_MODEL } from './config';
import { logAICost } from '../helpers/aiCostLogger';
import type { PromptTemplate, ExecuteResult, ExecuteMeta, AIMessage } from './types';
import { AIValidationError } from './types';

function buildCacheKey(task: string, promptVersion: string, input: string): string {
  const hash = createHash('sha256').update(input).digest('hex');
  return `ai:${task}:${promptVersion}:${hash}`;
}

// --- Interfaces ---

interface SingleExecuteParams<T> {
  task: string;
  input: Record<string, unknown>;
  template: PromptTemplate;
  schema: z.ZodType<T>;
  cacheKey?: string;
  userId?: string;
}

interface CoTExecuteParams<T> {
  task: string;
  input: Record<string, unknown>;
  reasoningTemplate: PromptTemplate;
  formatTemplate: PromptTemplate;
  schema: z.ZodType<T>;
  cacheKey?: string;
  userId?: string;
}

// --- Helpers ---

function interpolate(template: string, vars: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const val = vars[key];
    return val !== undefined ? String(val) : `{{${key}}}`;
  });
}

function buildMessages(template: PromptTemplate, input: Record<string, unknown>): AIMessage[] {
  const messages: AIMessage[] = [];

  // Build system prompt, optionally appending few-shot examples and scoring rubric
  let systemContent = template.systemPrompt;

  if (template.fewShotExamples && template.fewShotExamples.length > 0) {
    const examplesText = template.fewShotExamples
      .map((ex, idx) => {
        const lines = [`Example ${idx + 1}:`, `Input: ${ex.input}`, `Output: ${JSON.stringify(ex.output)}`];
        if (ex.explanation) lines.push(`Explanation: ${ex.explanation}`);
        return lines.join('\n');
      })
      .join('\n\n');
    systemContent += `\n\n--- Examples ---\n${examplesText}`;
  }

  if (template.scoringRubric) {
    const rubricText = template.scoringRubric.ranges
      .map(r => `${r.min}-${r.max} (${r.grade}): ${r.description}. Criteria: ${r.criteria.join(', ')}`)
      .join('\n');
    systemContent += `\n\n--- Scoring Rubric ---\n${rubricText}`;
  }

  messages.push({ role: 'system', content: systemContent });
  messages.push({ role: 'user', content: interpolate(template.userTemplate, input) });

  return messages;
}

function parseAndValidate<T>(content: string, schema: z.ZodType<T>): T {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    // Try to extract JSON from markdown code blocks
    const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      parsed = JSON.parse(match[1].trim());
    } else {
      throw new SyntaxError(`Invalid JSON: ${content.slice(0, 200)}`);
    }
  }
  return schema.parse(parsed);
}

// --- PromptExecutor ---

export class PromptExecutor {
  private cache: AICache;

  constructor() {
    this.cache = new AICache();
  }

  async execute<T>(params: SingleExecuteParams<T>): Promise<ExecuteResult<T>> {
    const { task, input, template, schema, userId } = params;

    const config = getTaskConfig(task);
    const { model, temperature, promptVersion } = config;

    // Build cache key
    const inputStr = JSON.stringify(input) + template.userTemplate;
    const cacheKey = params.cacheKey ?? buildCacheKey(task, promptVersion, inputStr);

    // Check cache
    const cached = await this.cache.get<ExecuteResult<T>>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build messages
    const messages = buildMessages(template, input);
    const provider = getProvider(model);

    // First attempt
    const response = await provider.complete({
      model,
      messages,
      temperature,
      jsonMode: true,
      maxTokens: config.maxTokens,
    });

    let data: T;
    let finalResponse = response;

    try {
      data = parseAndValidate(response.content, schema);
    } catch (err) {
      // Retry once with a fix-your-JSON follow-up
      const retryMessages: AIMessage[] = [
        ...messages,
        { role: 'assistant', content: response.content },
        {
          role: 'user',
          content: `Your previous response was not valid JSON matching the required schema. Error: ${String(err)}. Please respond with valid JSON only, no markdown.`,
        },
      ];

      const retryResponse = await provider.complete({
        model,
        messages: retryMessages,
        temperature,
        jsonMode: true,
        maxTokens: config.maxTokens,
      });

      finalResponse = retryResponse;

      try {
        data = parseAndValidate(retryResponse.content, schema);
      } catch (retryErr) {
        throw new AIValidationError(
          `AI response failed Zod validation after retry for task "${task}"`,
          retryResponse.content,
          retryErr instanceof z.ZodError ? retryErr : new z.ZodError([])
        );
      }
    }

    const cost = calculateCost(finalResponse.model, finalResponse.usage.inputTokens, finalResponse.usage.outputTokens);

    const meta: ExecuteMeta = {
      model: finalResponse.model,
      provider: finalResponse.provider,
      cached: false,
      latencyMs: finalResponse.latencyMs,
      cost,
      promptVersion,
    };

    const result: ExecuteResult<T> = { data, meta };

    // Cache the result
    await this.cache.set(cacheKey, result, CACHE_TTL_SECONDS);

    // Log cost
    logAICost({
      functionName: task,
      model: finalResponse.model,
      inputTokens: finalResponse.usage.inputTokens,
      outputTokens: finalResponse.usage.outputTokens,
      latencyMs: finalResponse.latencyMs,
      userId,
    });

    return result;
  }

  async executeCoT<T>(params: CoTExecuteParams<T>): Promise<ExecuteResult<T>> {
    const { task, input, reasoningTemplate, formatTemplate, schema, userId } = params;

    const config = getTaskConfig(task);
    const { model, temperature, promptVersion } = config;

    // Build cache key
    const inputStr = JSON.stringify(input) + reasoningTemplate.userTemplate + formatTemplate.userTemplate;
    const cacheKey = params.cacheKey ?? buildCacheKey(task, promptVersion, inputStr + ':cot');

    // Check cache
    const cached = await this.cache.get<ExecuteResult<T>>(cacheKey);
    if (cached) {
      return cached;
    }

    // Step 1: Reasoning — use configured model, plain text output
    const reasoningMessages = buildMessages(reasoningTemplate, input);
    const reasoningProvider = getProvider(model);

    const reasoningResponse = await reasoningProvider.complete({
      model,
      messages: reasoningMessages,
      temperature,
      jsonMode: false,
      maxTokens: config.maxTokens,
    });

    const reasoning = reasoningResponse.content;

    // Step 2: Formatting — use COT_FORMAT_MODEL, inject reasoning, JSON output
    const formatInput = { ...input, reasoning };
    const formatMessages = buildMessages(formatTemplate, formatInput);
    const formatProvider = getProvider(COT_FORMAT_MODEL);

    const formatResponse = await formatProvider.complete({
      model: COT_FORMAT_MODEL,
      messages: formatMessages,
      temperature: 0,
      jsonMode: true,
    });

    const data = parseAndValidate(formatResponse.content, schema);

    const totalCost =
      calculateCost(reasoningResponse.model, reasoningResponse.usage.inputTokens, reasoningResponse.usage.outputTokens) +
      calculateCost(formatResponse.model, formatResponse.usage.inputTokens, formatResponse.usage.outputTokens);

    const meta: ExecuteMeta = {
      model: formatResponse.model,
      provider: formatResponse.provider,
      cached: false,
      latencyMs: reasoningResponse.latencyMs + formatResponse.latencyMs,
      cost: totalCost,
      promptVersion,
      chainOfThought: reasoning,
    };

    const result: ExecuteResult<T> = { data, meta };

    // Cache the result
    await this.cache.set(cacheKey, result, CACHE_TTL_SECONDS);

    // Log cost for both steps
    logAICost({
      functionName: `${task}:reasoning`,
      model: reasoningResponse.model,
      inputTokens: reasoningResponse.usage.inputTokens,
      outputTokens: reasoningResponse.usage.outputTokens,
      latencyMs: reasoningResponse.latencyMs,
      userId,
    });

    logAICost({
      functionName: `${task}:format`,
      model: formatResponse.model,
      inputTokens: formatResponse.usage.inputTokens,
      outputTokens: formatResponse.usage.outputTokens,
      latencyMs: formatResponse.latencyMs,
      userId,
    });

    return result;
  }
}
