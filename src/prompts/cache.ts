import { createHash } from 'crypto';
import { redisClient } from '../services/redis';
import type { CacheStats } from './types';

export class AICache {
  private getRedis() {
    return redisClient.getClient();
  }

  static buildKey(task: string, promptVersion: string, input: string): string {
    const hash = createHash('sha256').update(input).digest('hex');
    return `ai:${task}:${promptVersion}:${hash}`;
  }

  private extractTask(key: string): string {
    const parts = key.split(':');
    return parts[1] || 'unknown';
  }

  async get<T>(key: string): Promise<T | null> {
    const redis = this.getRedis();
    if (!redis) return null;

    const task = this.extractTask(key);

    const cached = await redis.get(key);
    if (cached) {
      await redis.incr('ai:stats:hits');
      await redis.incr(`ai:stats:${task}:hits`);
      return JSON.parse(cached) as T;
    }

    await redis.incr('ai:stats:misses');
    await redis.incr(`ai:stats:${task}:misses`);
    return null;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const redis = this.getRedis();
    if (!redis) return;
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async invalidateTask(task: string): Promise<void> {
    const redis = this.getRedis();
    if (!redis) return;

    const keys = await redis.keys(`ai:${task}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  async getStats(): Promise<CacheStats> {
    const redis = this.getRedis();
    if (!redis) {
      return { hits: 0, misses: 0, hitRate: 0, byTask: {} };
    }

    const hits = parseInt((await redis.get('ai:stats:hits')) || '0', 10);
    const misses = parseInt((await redis.get('ai:stats:misses')) || '0', 10);
    const total = hits + misses;
    const hitRate = total > 0 ? parseFloat(((hits / total) * 100).toFixed(2)) : 0;

    const taskKeys = await redis.keys('ai:stats:*:hits');
    const byTask: Record<string, { hits: number; misses: number }> = {};

    for (const hKey of taskKeys) {
      const task = hKey.replace('ai:stats:', '').replace(':hits', '');
      const tHits = parseInt((await redis.get(hKey)) || '0', 10);
      const tMisses = parseInt(
        (await redis.get(`ai:stats:${task}:misses`)) || '0',
        10
      );
      byTask[task] = { hits: tHits, misses: tMisses };
    }

    return { hits, misses, hitRate, byTask };
  }
}
