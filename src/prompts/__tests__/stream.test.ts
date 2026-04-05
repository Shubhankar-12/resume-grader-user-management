import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPublish = vi.fn();
const mockSubscribe = vi.fn();
const mockUnsubscribe = vi.fn();
const mockOn = vi.fn();
const mockDuplicate = vi.fn();
const mockQuit = vi.fn();

vi.mock('../../services/redis', () => ({
  redisClient: {
    getClient: () => ({
      publish: mockPublish,
      duplicate: mockDuplicate,
    }),
  },
}));

mockDuplicate.mockReturnValue({
  subscribe: mockSubscribe,
  unsubscribe: mockUnsubscribe,
  on: mockOn,
  quit: mockQuit,
});

import { StreamBridge } from '../stream';

describe('StreamBridge', () => {
  let bridge: StreamBridge;

  beforeEach(() => {
    vi.clearAllMocks();
    bridge = new StreamBridge();
    mockDuplicate.mockReturnValue({
      subscribe: mockSubscribe,
      unsubscribe: mockUnsubscribe,
      on: mockOn,
      quit: mockQuit,
    });
  });

  it('publishes token event to correct Redis channel', async () => {
    mockPublish.mockResolvedValue(1);
    await bridge.publish('job-123', { type: 'token', content: 'Hello' });
    expect(mockPublish).toHaveBeenCalledWith(
      'stream:job-123',
      JSON.stringify({ type: 'token', content: 'Hello' })
    );
  });

  it('publishes done event with usage', async () => {
    mockPublish.mockResolvedValue(1);
    await bridge.publish('job-123', {
      type: 'done',
      content: 'full text',
      usage: { inputTokens: 10, outputTokens: 20 },
    });
    expect(mockPublish).toHaveBeenCalledWith(
      'stream:job-123',
      JSON.stringify({ type: 'done', content: 'full text', usage: { inputTokens: 10, outputTokens: 20 } })
    );
  });
});
