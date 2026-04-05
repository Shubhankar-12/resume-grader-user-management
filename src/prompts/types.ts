import { z } from 'zod';

// --- Provider types ---

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIProviderParams {
  model: string;
  messages: AIMessage[];
  temperature: number;
  jsonMode: boolean;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  usage: { inputTokens: number; outputTokens: number };
  model: string;
  provider: 'openai' | 'anthropic' | 'gemini';
  latencyMs: number;
}

export interface AIProvider {
  complete(params: AIProviderParams): Promise<AIResponse>;
}

// --- Prompt template types ---

export interface FewShotExample {
  input: string;
  output: Record<string, unknown>;
  explanation?: string;
}

export interface ScoringRubric {
  ranges: {
    min: number;
    max: number;
    grade: string;
    description: string;
    criteria: string[];
  }[];
}

export interface PromptTemplate {
  task: string;
  systemPrompt: string;
  userTemplate: string;
  fewShotExamples?: FewShotExample[];
  scoringRubric?: ScoringRubric;
}

// --- Executor types ---

export interface ExecuteParams {
  task: string;
  input: Record<string, unknown>;
  cacheKey?: string;
  userId?: string;
}

export interface ExecuteMeta {
  model: string;
  provider: 'openai' | 'anthropic' | 'gemini';
  cached: boolean;
  latencyMs: number;
  cost: number;
  promptVersion: string;
  chainOfThought?: string;
}

export interface ExecuteResult<T> {
  data: T;
  meta: ExecuteMeta;
}

// --- Config types ---

export interface TaskConfig {
  task: string;
  model: string;
  temperature: number;
  maxTokens?: number;
  useChainOfThought: boolean;
  promptVersion: string;
}

export interface TaskDefault {
  envVar: string;
  defaultModel: string;
  temperature: number;
  useChainOfThought: boolean;
  promptVersion: string;
}

// --- Cost types ---

export interface CostLogParams {
  functionName: string;
  model: string;
  provider: 'openai' | 'anthropic' | 'gemini';
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  cached: boolean;
  promptVersion: string;
  userId?: string;
}

// --- Cache types ---

export interface CacheMeta {
  model: string;
  cost: number;
  latencyMs: number;
  createdAt: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  byTask: Record<string, { hits: number; misses: number }>;
}

// --- Error types ---

export class AIValidationError extends Error {
  constructor(
    message: string,
    public rawResponse: string,
    public zodErrors: z.ZodError
  ) {
    super(message);
    this.name = 'AIValidationError';
  }
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    public provider: string,
    public model: string
  ) {
    super(message);
    this.name = 'AIProviderError';
  }
}
