import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

const { mockComplete, mockCompleteStream, mockCacheGet, mockCacheSet, mockPublish } = vi.hoisted(() => {
  return {
    mockComplete: vi.fn(),
    mockCompleteStream: vi.fn(),
    mockCacheGet: vi.fn(),
    mockCacheSet: vi.fn(),
    mockPublish: vi.fn(),
  };
});

vi.mock('../providers', () => ({
  getProvider: () => ({
    complete: mockComplete,
    completeStream: mockCompleteStream,
  }),
}));

vi.mock('../cache', () => {
  class AICache {
    get = mockCacheGet;
    set = mockCacheSet;
  }
  return { AICache };
});

vi.mock('../stream', () => {
  class StreamBridge {
    publish = mockPublish;
  }
  return { StreamBridge };
});

vi.mock('../../helpers/aiCostLogger', () => ({
  logAICost: vi.fn(),
}));

import { PromptExecutor } from '../executor';
import type { PromptTemplate } from '../types';

const coverLetterSchema = z.object({
  cover_letter: z.string(),
  cover_letter_summary: z.string(),
});

const template: PromptTemplate = {
  task: 'coverLetter',
  systemPrompt: 'Generate a cover letter.',
  userTemplate: 'Resume: {{extractedFields}} JD: {{jobDescription}}',
};

describe('PromptExecutor.executeStream', () => {
  let executor: PromptExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCacheGet.mockResolvedValue(null);
    mockPublish.mockResolvedValue(undefined);
    executor = new PromptExecutor();
  });

  it('streams tokens and publishes only cover_letter content', async () => {
    const tokens = ['{"', 'cover_letter', '": "', 'Dear ', 'Hiring ', 'Manager', '", "cover_letter_summary": "A summary"}'];

    async function* fakeStream() {
      let full = '';
      for (const t of tokens) {
        full += t;
        yield { type: 'token' as const, content: t };
      }
      yield { type: 'done' as const, content: full, usage: { inputTokens: 50, outputTokens: 30 } };
    }

    mockCompleteStream.mockReturnValue(fakeStream());

    const result = await executor.executeStream({
      task: 'coverLetter',
      input: { extractedFields: '{}', jobDescription: 'test' },
      template,
      schema: coverLetterSchema,
      jobId: 'job-123',
    });

    expect(result.data.cover_letter).toBe('Dear Hiring Manager');
    expect(result.data.cover_letter_summary).toBe('A summary');

    const publishedTokens = mockPublish.mock.calls
      .filter(([, event]: any) => event.type === 'token')
      .map(([, event]: any) => event.content);

    // Should contain cover letter text tokens
    expect(publishedTokens.join('')).toContain('Dear ');
    expect(publishedTokens.join('')).toContain('Hiring ');
    // Should NOT contain JSON syntax
    expect(publishedTokens.join('')).not.toContain('{');
    expect(publishedTokens.join('')).not.toContain('cover_letter_summary');
  });

  it('returns cached result and publishes chunked done', async () => {
    const cached = {
      data: { cover_letter: 'Cached letter text here', cover_letter_summary: 'Summary' },
      meta: { model: 'gpt-4o-mini', provider: 'openai', cached: true, latencyMs: 0, cost: 0, promptVersion: 'v1' },
    };
    mockCacheGet.mockResolvedValue(cached);

    const result = await executor.executeStream({
      task: 'coverLetter',
      input: { extractedFields: '{}', jobDescription: 'test' },
      template,
      schema: coverLetterSchema,
      jobId: 'job-456',
    });

    expect(result.data.cover_letter).toBe('Cached letter text here');
    expect(mockCompleteStream).not.toHaveBeenCalled();

    const doneEvent = mockPublish.mock.calls.find(([, event]: any) => event.type === 'done');
    expect(doneEvent).toBeDefined();
  });
});
