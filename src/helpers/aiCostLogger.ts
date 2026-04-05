import { makeLogger } from '../logger/Config';
import { COST_PER_1K, detectProvider } from '../prompts/config';
import { aiCostLogQueries } from '../db/queries/AICostLogQueries';

const logger = makeLogger({});

export function logAICost(params: {
  functionName: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  userId?: string;
  provider?: string;
  cached?: boolean;
  promptVersion?: string;
}): void {
  const pricing = COST_PER_1K[params.model] || COST_PER_1K['gpt-4o-mini'];
  const costUSD =
    (params.inputTokens / 1000) * pricing.input +
    (params.outputTokens / 1000) * pricing.output;
  const provider = params.provider ?? detectProvider(params.model);
  const cached = params.cached ?? false;
  const promptVersion = params.promptVersion ?? 'v1';

  logger.info('ai_cost', {
    functionName: params.functionName,
    model: params.model,
    provider,
    inputTokens: params.inputTokens,
    outputTokens: params.outputTokens,
    estimatedCostUSD: parseFloat(costUSD.toFixed(6)),
    latencyMs: params.latencyMs,
    cached,
    promptVersion,
    userId: params.userId || null,
    timestamp: new Date().toISOString(),
  });

  aiCostLogQueries
    .create({
      functionName: params.functionName,
      model: params.model,
      provider,
      inputTokens: params.inputTokens,
      outputTokens: params.outputTokens,
      estimatedCostUSD: parseFloat(costUSD.toFixed(6)),
      latencyMs: params.latencyMs,
      cached,
      promptVersion,
      userId: params.userId || null,
    })
    .catch((err) => {
      logger.error('ai_cost_persist_error', { error: err?.message });
    });
}
