import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGet = vi.fn();
const mockSet = vi.fn();
const mockDel = vi.fn();
const mockIncr = vi.fn();
const mockKeys = vi.fn();

vi.mock('../../services/redis', () => ({
  redisClient: {
    getClient: () => ({
      get: mockGet,
      set: mockSet,
      del: mockDel,
      incr: mockIncr,
      keys: mockKeys,
    }),
  },
}));

import { AICache } from '../cache';

describe('AICache', () => {
  let cache: AICache;

  beforeEach(() => {
    vi.clearAllMocks();
    cache = new AICache();
  });

  it('returns null on cache miss', async () => {
    mockGet.mockResolvedValue(null);
    const result = await cache.get('ai:grading:v2:abc123');
    expect(result).toBeNull();
    expect(mockIncr).toHaveBeenCalledWith('ai:stats:misses');
    expect(mockIncr).toHaveBeenCalledWith('ai:stats:grading:misses');
  });

  it('returns parsed data on cache hit', async () => {
    const cached = { data: { score: 85 }, meta: { model: 'gpt-4o' } };
    mockGet.mockResolvedValue(JSON.stringify(cached));

    const result = await cache.get('ai:grading:v2:abc123');
    expect(result).toEqual(cached);
    expect(mockIncr).toHaveBeenCalledWith('ai:stats:hits');
    expect(mockIncr).toHaveBeenCalledWith('ai:stats:grading:hits');
  });

  it('sets cache with TTL', async () => {
    const value = { data: { score: 85 }, meta: {} };
    await cache.set('ai:grading:v2:abc123', value, 604800);

    expect(mockSet).toHaveBeenCalledWith(
      'ai:grading:v2:abc123',
      JSON.stringify(value),
      'EX',
      604800
    );
  });

  it('builds correct cache key', () => {
    const key = AICache.buildKey('grading', 'v2', 'hello world');
    expect(key).toMatch(/^ai:grading:v2:[a-f0-9]{64}$/);
  });

  it('extracts task name from cache key for stats', async () => {
    mockGet.mockResolvedValue(null);
    await cache.get('ai:extraction:v1:def456');
    expect(mockIncr).toHaveBeenCalledWith('ai:stats:extraction:misses');
  });

  it('returns stats from Redis counters', async () => {
    mockGet.mockImplementation((key: string) => {
      const map: Record<string, string> = {
        'ai:stats:hits': '100',
        'ai:stats:misses': '50',
        'ai:stats:grading:hits': '40',
        'ai:stats:grading:misses': '20',
      };
      return Promise.resolve(map[key] || '0');
    });
    mockKeys.mockResolvedValue([
      'ai:stats:grading:hits',
      'ai:stats:grading:misses',
    ]);

    const stats = await cache.getStats();
    expect(stats.hits).toBe(100);
    expect(stats.misses).toBe(50);
    expect(stats.hitRate).toBeCloseTo(66.67, 1);
  });
});
