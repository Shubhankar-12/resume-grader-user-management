import { TaskDefault, TaskConfig } from './types';

export const TASK_DEFAULTS: Record<string, TaskDefault> = {
  grading: {
    envVar: 'AI_MODEL_GRADING',
    defaultModel: 'gpt-4o',
    temperature: 0,
    useChainOfThought: true,
    promptVersion: 'v2',
  },
  extraction: {
    envVar: 'AI_MODEL_EXTRACTION',
    defaultModel: 'gpt-4o-mini',
    temperature: 0,
    useChainOfThought: false,
    promptVersion: 'v1',
  },
  report: {
    envVar: 'AI_MODEL_REPORT',
    defaultModel: 'gpt-4o',
    temperature: 0,
    useChainOfThought: true,
    promptVersion: 'v2',
  },
  tailoring: {
    envVar: 'AI_MODEL_TAILORING',
    defaultModel: 'gpt-4o',
    temperature: 0,
    useChainOfThought: true,
    promptVersion: 'v2',
  },
  jobMatch: {
    envVar: 'AI_MODEL_JOB_MATCH',
    defaultModel: 'gpt-4o-mini',
    temperature: 0,
    useChainOfThought: false,
    promptVersion: 'v1',
  },
  coverLetter: {
    envVar: 'AI_MODEL_COVER_LETTER',
    defaultModel: 'gpt-4o-mini',
    temperature: 0,
    useChainOfThought: false,
    promptVersion: 'v1',
  },
  projectAnalysis: {
    envVar: 'AI_MODEL_PROJECT_ANALYSIS',
    defaultModel: 'gpt-4o-mini',
    temperature: 0.3,
    useChainOfThought: false,
    promptVersion: 'v1',
  },
};

export const COST_PER_1K: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'claude-sonnet-4-6': { input: 0.003, output: 0.015 },
  'gemini-2.5-pro': { input: 0.00125, output: 0.01 },
  'gemini-2.0-flash': { input: 0.0001, output: 0.0004 },
};

// CoT step 2 always uses this model (cheap formatting)
export const COT_FORMAT_MODEL = 'gpt-4o-mini';

export const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

const KNOWN_MODELS = new Set(Object.keys(COST_PER_1K));

export function getTaskConfig(task: string): TaskConfig {
  const defaults = TASK_DEFAULTS[task];
  if (!defaults) {
    throw new Error(`Unknown AI task: ${task}`);
  }

  const model = process.env[defaults.envVar] || defaults.defaultModel;

  if (!KNOWN_MODELS.has(model)) {
    throw new Error(
      `Unknown model "${model}" for task "${task}" (env: ${defaults.envVar}). Known models: ${[...KNOWN_MODELS].join(', ')}`
    );
  }

  return {
    task,
    model,
    temperature: defaults.temperature,
    useChainOfThought: defaults.useChainOfThought,
    promptVersion: defaults.promptVersion,
  };
}

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = COST_PER_1K[model] || COST_PER_1K['gpt-4o-mini'];
  return (inputTokens / 1000) * pricing.input + (outputTokens / 1000) * pricing.output;
}

export function detectProvider(model: string): 'openai' | 'anthropic' | 'gemini' {
  if (model.startsWith('gpt-')) return 'openai';
  if (model.startsWith('claude-')) return 'anthropic';
  if (model.startsWith('gemini-')) return 'gemini';
  throw new Error(`Cannot detect provider for model: ${model}`);
}
