import { makeLogger } from "../logger/Config";

const logger = makeLogger({});

const COST_PER_1K: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
  "gpt-4o": { input: 0.0025, output: 0.01 },
};

export function logAICost(params: {
  functionName: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  userId?: string;
}): void {
  const pricing = COST_PER_1K[params.model] || COST_PER_1K["gpt-4o-mini"];
  const costUSD =
    (params.inputTokens / 1000) * pricing.input +
    (params.outputTokens / 1000) * pricing.output;

  logger.info("ai_cost", {
    functionName: params.functionName,
    model: params.model,
    inputTokens: params.inputTokens,
    outputTokens: params.outputTokens,
    estimatedCostUSD: parseFloat(costUSD.toFixed(6)),
    latencyMs: params.latencyMs,
    userId: params.userId || null,
    timestamp: new Date().toISOString(),
  });
}
