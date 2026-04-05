import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIProvider } from '../providers/openai';
import type { AIProviderParams } from '../providers/types';

// ---------------------------------------------------------------------------
// Mock the OpenAI SDK
// ---------------------------------------------------------------------------

const mockCreate = vi.fn();

vi.mock('openai', () => {
  class MockOpenAI {
    chat = { completions: { create: mockCreate } };
    constructor(_opts: unknown) {}
  }
  return { default: MockOpenAI };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeOpenAIResponse(content: string, promptTokens = 10, completionTokens = 20) {
  return {
    choices: [{ message: { content } }],
    usage: { prompt_tokens: promptTokens, completion_tokens: completionTokens },
    model: 'gpt-4o-mini',
  };
}

const baseParams: AIProviderParams = {
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello' }],
  temperature: 0.7,
  jsonMode: false,
};

// ---------------------------------------------------------------------------
// OpenAI Provider Tests
// ---------------------------------------------------------------------------

describe('OpenAIProvider', () => {
  let provider: OpenAIProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new OpenAIProvider('test-api-key');
  });

  it('completes a request and normalizes the response', async () => {
    mockCreate.mockResolvedValueOnce(makeOpenAIResponse('Hello there!', 15, 25));

    const result = await provider.complete(baseParams);

    expect(result.content).toBe('Hello there!');
    expect(result.usage.inputTokens).toBe(15);
    expect(result.usage.outputTokens).toBe(25);
    expect(result.provider).toBe('openai');
    expect(result.model).toBe('gpt-4o-mini');
    expect(typeof result.latencyMs).toBe('number');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('passes jsonMode as response_format json_object', async () => {
    mockCreate.mockResolvedValueOnce(makeOpenAIResponse('{"key":"value"}', 10, 10));

    await provider.complete({ ...baseParams, jsonMode: true });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        response_format: { type: 'json_object' },
      })
    );
  });

  it('does not pass response_format when jsonMode is false', async () => {
    mockCreate.mockResolvedValueOnce(makeOpenAIResponse('plain text', 5, 5));

    await provider.complete({ ...baseParams, jsonMode: false });

    const callArg = mockCreate.mock.calls[0][0] as Record<string, unknown>;
    expect(callArg.response_format).toBeUndefined();
  });

  it('passes maxTokens as max_tokens when provided', async () => {
    mockCreate.mockResolvedValueOnce(makeOpenAIResponse('response', 5, 5));

    await provider.complete({ ...baseParams, maxTokens: 512 });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ max_tokens: 512 })
    );
  });

  it('does not pass max_tokens when maxTokens is undefined', async () => {
    mockCreate.mockResolvedValueOnce(makeOpenAIResponse('response', 5, 5));

    const { maxTokens: _, ...paramsWithoutMaxTokens } = { ...baseParams, maxTokens: undefined };
    await provider.complete(paramsWithoutMaxTokens);

    const callArg = mockCreate.mock.calls[0][0] as Record<string, unknown>;
    expect(callArg.max_tokens).toBeUndefined();
  });

  it('returns empty string content when choices are empty', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [],
      usage: { prompt_tokens: 5, completion_tokens: 0 },
    });

    const result = await provider.complete(baseParams);

    expect(result.content).toBe('');
  });

  it('returns zero tokens when usage is undefined', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'hi' } }],
      usage: undefined,
    });

    const result = await provider.complete(baseParams);

    expect(result.usage.inputTokens).toBe(0);
    expect(result.usage.outputTokens).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Anthropic Provider Tests — placeholder for Task 3
// ---------------------------------------------------------------------------

describe.todo('AnthropicProvider');

// ---------------------------------------------------------------------------
// Gemini Provider Tests — placeholder for Task 4
// ---------------------------------------------------------------------------

describe.todo('GeminiProvider');
