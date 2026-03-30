import { Worker } from "bullmq";
import { redisClient } from "../services/redis";
import { processResumeGradeJob } from "./workers/resumeGradeWorker";
import { processCoverLetterJob } from "./workers/coverLetterWorker";
import { processTailoredResumeJob } from "./workers/tailoredResumeWorker";

const redisConnection = redisClient.getClient();

const connection = redisConnection
  ? {
      host: redisConnection.options.host || "localhost",
      port: redisConnection.options.port || 6379,
    }
  : { host: "localhost", port: 6379 };

const processorMap: Record<string, (data: any) => Promise<void>> = {
  "resume-grade": processResumeGradeJob,
  "cover-letter": processCoverLetterJob,
  "tailored-resume": processTailoredResumeJob,
};

export function startWorkers(): void {
  const worker = new Worker(
    "ai-jobs",
    async (job) => {
      const processor = processorMap[job.name];
      if (!processor) {
        throw new Error(`Unknown job type: ${job.name}`);
      }
      await processor(job.data);
    },
    {
      connection,
      concurrency: 2,
    }
  );

  worker.on("completed", (job) => {
    if (global.logger) {
      global.logger.info(`Job ${job.id} (${job.name}) completed`);
    }
  });

  worker.on("failed", (job, err) => {
    if (global.logger) {
      global.logger.error(`Job ${job?.id} (${job?.name}) failed: ${err.message}`);
    }
  });
}
