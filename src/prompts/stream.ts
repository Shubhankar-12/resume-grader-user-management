import { redisClient } from '../services/redis';
import type { AIStreamEvent } from './types';
import type Redis from 'ioredis';

const CHANNEL_PREFIX = 'stream:';

export class StreamBridge {
  private getRedis(): Redis | null {
    return redisClient.getClient();
  }

  async publish(jobId: string, event: AIStreamEvent): Promise<void> {
    const redis = this.getRedis();
    if (!redis) return;
    await redis.publish(
      `${CHANNEL_PREFIX}${jobId}`,
      JSON.stringify(event)
    );
  }

  async *subscribe(jobId: string): AsyncGenerator<AIStreamEvent> {
    const redis = this.getRedis();
    if (!redis) return;

    const subscriber = redis.duplicate();
    const channel = `${CHANNEL_PREFIX}${jobId}`;

    const eventQueue: AIStreamEvent[] = [];
    let resolve: (() => void) | null = null;
    let done = false;

    subscriber.on('message', (_ch: string, message: string) => {
      try {
        const event = JSON.parse(message) as AIStreamEvent;
        eventQueue.push(event);
        if (event.type === 'done' || event.type === 'error') {
          done = true;
        }
        if (resolve) {
          resolve();
          resolve = null;
        }
      } catch {
        // Ignore parse errors
      }
    });

    await subscriber.subscribe(channel);

    try {
      while (true) {
        if (eventQueue.length === 0 && !done) {
          await new Promise<void>((r) => { resolve = r; });
        }

        while (eventQueue.length > 0) {
          const event = eventQueue.shift()!;
          yield event;
          if (event.type === 'done' || event.type === 'error') {
            return;
          }
        }

        if (done) return;
      }
    } finally {
      await subscriber.unsubscribe(channel);
      await subscriber.quit();
    }
  }
}
