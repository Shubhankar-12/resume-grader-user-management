import Redis from 'ioredis';
import { makeLogger } from '../logger/Config';

const logger = makeLogger({});

class RedisClient {
  private static instance: RedisClient;
  private client: Redis | null = null;

  private constructor() {}

  static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  async connect(): Promise<void> {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.client = new Redis(url);
      this.client.on('connect', () => logger.info('Redis connected'));
      this.client.on('error', (err) => logger.error('Redis error', err));
    } catch (err) {
      logger.warn('Redis connection failed — app will run without cache', err);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) return null;
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.client) return;
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return;
    await this.client.del(key);
  }

  async getOrSet<T>(
      key: string,
      ttlSeconds: number,
      factory: () => Promise<T>
  ): Promise<T> {
    const cached = await this.get(key);
    if (cached) return JSON.parse(cached) as T;

    const value = await factory();
    await this.set(key, JSON.stringify(value), ttlSeconds);
    return value;
  }

  getClient(): Redis | null {
    return this.client;
  }
}

export const redisClient = RedisClient.getInstance();
