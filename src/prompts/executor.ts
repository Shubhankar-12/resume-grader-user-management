import { z } from 'zod';
import { createHash } from 'crypto';
import { getProvider } from './providers';
import { AICache } from './cache';
import { getTaskConfig, calculateCost, CACHE_TTL_SECONDS, COT_FORMAT_MODEL } from './config';
import { logAICost } from '../helpers/aiCostLogger';
import type { PromptTemplate, ExecuteResult, ExecuteMeta, AIMessage, AIStreamEvent } from './types';
import { AIValidationError } from './types';
import { StreamBridge } from './stream';

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

interface StreamExecuteParams<T> {
  task: string;
  input: Record<string, unknown>;
  template: PromptTemplate;
  schema: z.ZodType<T>;
  jobId: string;
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

// --- CoverLetterTokenFilter ---

class CoverLetterTokenFilter {
  private state: 'WAITING' | 'FOUND_KEY' | 'STREAMING' | 'DONE' = 'WAITING';
  private buffer = '';

  process(token: string): string | null {
    this.buffer += token;
    if (this.state === 'DONE') return null;

    if (this.state === 'STREAMING') {
      let i = 0;
      while (i < token.length) {
        if (token[i] === '\\') { i += 2; continue; }
        if (token[i] === '"') {
          this.state = 'DONE';
          return i > 0 ? token.substring(0, i) : null;
        }
        i++;
      }
      return token;
    }

    if (this.state === 'WAITING' && this.buffer.includes('"cover_letter"')) {
      this.state = 'FOUND_KEY';
    }

    if (this.state === 'FOUND_KEY') {
      const keyEnd = this.buffer.indexOf('"cover_letter"');
      const afterKey = this.buffer.substring(keyEnd + '"cover_letter"'.length);
      const valueStart = afterKey.indexOf('"');
      if (valueStart !== -1) {
        this.state = 'STREAMING';
        const afterQuote = afterKey.substring(valueStart + 1);
        if (afterQuote.length > 0) {
          const closeIdx = afterQuote.indexOf('"');
          if (closeIdx !== -1 && (closeIdx === 0 || afterQuote[closeIdx - 1] !== '\\')) {
            this.state = 'DONE';
            return closeIdx > 0 ? afterQuote.substring(0, closeIdx) : null;
          }
          return afterQuote;
        }
      }
    }

    return null;
  }
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

  async executeStream<T>(params: StreamExecuteParams<T>): Promise<ExecuteResult<T>> {
    const { task, input, template, schema, jobId, userId } = params;
    const bridge = new StreamBridge();
    const config = getTaskConfig(task);
    const { model, temperature, promptVersion } = config;

    const inputStr = JSON.stringify(input) + template.userTemplate;
    const cacheKey = params.cacheKey ?? buildCacheKey(task, promptVersion, inputStr);

    // Cache check — stream cached result as chunked tokens
    const cached = await this.cache.get<ExecuteResult<T>>(cacheKey);
    if (cached) {
      const cachedData = cached.data as Record<string, unknown>;
      if (cachedData?.cover_letter) {
        const text = cachedData.cover_letter as string;
        const chunkSize = 20;
        for (let i = 0; i < text.length; i += chunkSize) {
          await bridge.publish(jobId, { type: 'token', content: text.substring(i, i + chunkSize) });
        }
      }
      await bridge.publish(jobId, { type: 'done', content: '' });
      return cached;
    }

    // Check provider supports streaming
    const provider = getProvider(model);
    if (!provider.completeStream) {
      const result = await this.execute({ task, input, template, schema, cacheKey: params.cacheKey, userId });
      await bridge.publish(jobId, { type: 'done', content: '' });
      return result;
    }

    const messages = buildMessages(template, input);
    const filter = new CoverLetterTokenFilter();
    let fullContent = '';
    let usage = { inputTokens: 0, outputTokens: 0 };

    for await (const event of provider.completeStream({
      model, messages, temperature, jsonMode: true, maxTokens: config.maxTokens,
    })) {
      if (event.type === 'token') {
        const filtered = filter.process(event.content);
        if (filtered) {
          await bridge.publish(jobId, { type: 'token', content: filtered });
        }
      } else if (event.type === 'done') {
        fullContent = event.content;
        usage = event.usage || usage;
      } else if (event.type === 'error') {
        await bridge.publish(jobId, { type: 'error', content: event.content });
        throw new Error(`Stream error: ${event.content}`);
      }
    }

    const data = parseAndValidate(fullContent, schema);
    const cost = calculateCost(model, usage.inputTokens, usage.outputTokens);

    const meta: ExecuteMeta = {
      model, provider: 'openai', cached: false, latencyMs: 0, cost, promptVersion,
    };

    const result: ExecuteResult<T> = { data, meta };
    await this.cache.set(cacheKey, result, CACHE_TTL_SECONDS);
    await bridge.publish(jobId, { type: 'done', content: '' });

    logAICost({ functionName: task, model, inputTokens: usage.inputTokens, outputTokens: usage.outputTokens, latencyMs: 0, userId });

    return result;
  }
}
