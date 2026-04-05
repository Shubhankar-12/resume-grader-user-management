import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreate = vi.fn();

vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      chat = { completions: { create: mockCreate } };
    },
  };
});

import { OpenAIProvider } from '../providers/openai';

describe('OpenAIProvider.completeStream', () => {
  let provider: OpenAIProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new OpenAIProvider('test-key');
  });

  it('yields token events for each chunk then done', async () => {
    const chunks = [
      { choices: [{ delta: { content: 'Hello' } }] },
      { choices: [{ delta: { content: ' world' } }] },
      { choices: [{ delta: {} }], usage: { prompt_tokens: 10, completion_tokens: 5 } },
    ];

    const asyncIterable = {
      async *[Symbol.asyncIterator]() {
        for (const chunk of chunks) yield chunk;
      },
    };
    mockCreate.mockResolvedValue(asyncIterable);

    const events: any[] = [];
    for await (const event of provider.completeStream!({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hi' }],
      temperature: 0,
      jsonMode: false,
    })) {
      events.push(event);
    }

    expect(events).toHaveLength(3);
    expect(events[0]).toEqual({ type: 'token', content: 'Hello' });
    expect(events[1]).toEqual({ type: 'token', content: ' world' });
    expect(events[2]).toEqual({
      type: 'done',
      content: 'Hello world',
      usage: { inputTokens: 10, outputTokens: 5 },
    });
  });

  it('passes stream: true and stream_options to OpenAI SDK', async () => {
    const asyncIterable = {
      async *[Symbol.asyncIterator]() {
        yield { choices: [{ delta: {} }], usage: { prompt_tokens: 1, completion_tokens: 1 } };
      },
    };
    mockCreate.mockResolvedValue(asyncIterable);

    for await (const _ of provider.completeStream!({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hi' }],
      temperature: 0,
      jsonMode: true,
    })) { /* drain */ }

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ stream: true, stream_options: { include_usage: true } })
    );
  });

  it('yields error event on exception', async () => {
    mockCreate.mockRejectedValue(new Error('API failure'));

    const events: any[] = [];
    for await (const event of provider.completeStream!({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hi' }],
      temperature: 0,
      jsonMode: false,
    })) {
      events.push(event);
    }

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({ type: 'error', content: 'API failure' });
  });
});
