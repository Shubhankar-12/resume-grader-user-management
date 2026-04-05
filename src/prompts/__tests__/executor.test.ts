import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

// Mock provider
const mockComplete = vi.fn();
vi.mock('../providers', () => ({
  getProvider: () => ({ complete: mockComplete }),
}));

// Mock cache
const mockCacheGet = vi.fn();
const mockCacheSet = vi.fn();
vi.mock('../cache', () => ({
  AICache: vi.fn().mockImplementation(function () {
    return {
      get: mockCacheGet,
      set: mockCacheSet,
    };
  }),
}));

// Mock cost logger
vi.mock('../../helpers/aiCostLogger', () => ({
  logAICost: vi.fn(),
}));

import { PromptExecutor } from '../executor';
import type { PromptTemplate } from '../types';

const testSchema = z.object({
  score: z.number(),
  message: z.string(),
});

const testTemplate: PromptTemplate = {
  task: 'grading',
  systemPrompt: 'You are a grader.',
  userTemplate: 'Grade this: {{resumeText}}',
};

describe('PromptExecutor', () => {
  let executor: PromptExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCacheGet.mockResolvedValue(null);
    executor = new PromptExecutor();
  });

  it('executes a single-call prompt and returns validated data', async () => {
    mockComplete.mockResolvedValue({
      content: '{"score": 85, "message": "Good resume"}',
      usage: { inputTokens: 100, outputTokens: 50 },
      model: 'gpt-4o-mini',
      provider: 'openai',
      latencyMs: 200,
    });

    const result = await executor.execute({
      task: 'extraction',
      input: { resumeText: 'John Doe, Software Engineer' },
      template: testTemplate,
      schema: testSchema,
    });

    expect(result.data).toEqual({ score: 85, message: 'Good resume' });
    expect(result.meta.cached).toBe(false);
    expect(result.meta.provider).toBe('openai');
  });

  it('returns cached result on cache hit', async () => {
    const cached = {
      data: { score: 90, message: 'Cached' },
      meta: { model: 'gpt-4o', provider: 'openai', cached: true, latencyMs: 0, cost: 0.001, promptVersion: 'v1' },
    };
    mockCacheGet.mockResolvedValue(cached);

    const result = await executor.execute({
      task: 'extraction',
      input: { resumeText: 'test' },
      template: testTemplate,
      schema: testSchema,
    });

    expect(result.data).toEqual({ score: 90, message: 'Cached' });
    expect(result.meta.cached).toBe(true);
    expect(mockComplete).not.toHaveBeenCalled();
  });

  it('interpolates template variables', async () => {
    mockComplete.mockResolvedValue({
      content: '{"score": 70, "message": "OK"}',
      usage: { inputTokens: 50, outputTokens: 30 },
      model: 'gpt-4o-mini',
      provider: 'openai',
      latencyMs: 100,
    });

    await executor.execute({
      task: 'extraction',
      input: { resumeText: 'My resume content' },
      template: testTemplate,
      schema: testSchema,
    });

    expect(mockComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: 'Grade this: My resume content',
          }),
        ]),
      })
    );
  });

  it('retries once on Zod validation failure', async () => {
    mockComplete
      .mockResolvedValueOnce({
        content: '{"invalid": true}',
        usage: { inputTokens: 50, outputTokens: 30 },
        model: 'gpt-4o-mini',
        provider: 'openai',
        latencyMs: 100,
      })
      .mockResolvedValueOnce({
        content: '{"score": 80, "message": "Fixed"}',
        usage: { inputTokens: 80, outputTokens: 40 },
        model: 'gpt-4o-mini',
        provider: 'openai',
        latencyMs: 150,
      });

    const result = await executor.execute({
      task: 'extraction',
      input: { resumeText: 'test' },
      template: testTemplate,
      schema: testSchema,
    });

    expect(result.data).toEqual({ score: 80, message: 'Fixed' });
    expect(mockComplete).toHaveBeenCalledTimes(2);
  });

  it('executes CoT two-step flow', async () => {
    // Step 1: reasoning (plain text)
    mockComplete.mockResolvedValueOnce({
      content: 'This resume shows strong backend skills...',
      usage: { inputTokens: 200, outputTokens: 300 },
      model: 'gpt-4o',
      provider: 'openai',
      latencyMs: 500,
    });
    // Step 2: formatting (JSON)
    mockComplete.mockResolvedValueOnce({
      content: '{"score": 88, "message": "Strong backend"}',
      usage: { inputTokens: 400, outputTokens: 100 },
      model: 'gpt-4o-mini',
      provider: 'openai',
      latencyMs: 200,
    });

    const formatTemplate: PromptTemplate = {
      task: 'grading',
      systemPrompt: 'Convert analysis to JSON.',
      userTemplate: 'Analysis:\n{{reasoning}}\n\nProduce JSON.',
    };

    const result = await executor.executeCoT({
      task: 'grading',
      input: { resumeText: 'Senior engineer resume...' },
      reasoningTemplate: testTemplate,
      formatTemplate,
      schema: testSchema,
    });

    expect(result.data).toEqual({ score: 88, message: 'Strong backend' });
    expect(result.meta.chainOfThought).toBe('This resume shows strong backend skills...');
    expect(mockComplete).toHaveBeenCalledTimes(2);
  });
});
