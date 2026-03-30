import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("bullmq", () => {
  const MockQueue = vi.fn().mockImplementation(function () {
    return {
      add: vi.fn().mockResolvedValue({ id: "mock-job-id" }),
      close: vi.fn().mockResolvedValue(undefined),
    };
  });
  return { Queue: MockQueue };
});

vi.mock("../../services/redis", () => ({
  redisClient: {
    getClient: vi.fn().mockReturnValue({
      options: { host: "localhost", port: 6379 },
      duplicate: vi.fn().mockReturnValue({}),
    }),
  },
}));

describe("Job Queue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should export an enqueueJob function", async () => {
    const { enqueueJob } = await import("../queue");
    expect(enqueueJob).toBeDefined();
    expect(typeof enqueueJob).toBe("function");
  });

  it("should enqueue a job with correct parameters", async () => {
    const { enqueueJob, aiQueue } = await import("../queue");

    await enqueueJob("resume-grade", {
      jobId: "db-job-id",
      resume_id: "resume-123",
      user_id: "user-456",
    });

    expect(aiQueue.add).toHaveBeenCalledWith(
      "resume-grade",
      {
        jobId: "db-job-id",
        resume_id: "resume-123",
        user_id: "user-456",
      },
      expect.objectContaining({
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 },
      })
    );
  });

  it("should use the correct queue name", async () => {
    const { Queue } = await import("bullmq");
    await import("../queue");
    expect(Queue).toHaveBeenCalledWith("ai-jobs", expect.any(Object));
  });
});
