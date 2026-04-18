import { Queue, JobsOptions } from "bullmq";
import { redisClient } from "../services/redis";

const redisConnection = redisClient.getClient();

const connection = redisConnection
  ? {
      host: redisConnection.options.host || "localhost",
      port: redisConnection.options.port || 6379,
    }
  : { host: "localhost", port: 6379 };

export const aiQueue = new Queue("ai-jobs", { connection });

export async function enqueueJob(
  type: string,
  data: Record<string, unknown>,
  options?: JobsOptions
): Promise<void> {
  await aiQueue.add(type, data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
    ...options,
  });
}
