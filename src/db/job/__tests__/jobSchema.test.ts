import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { jobModel } from "../model";

describe("Job Schema", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.TEST_DB_URI || "mongodb://localhost:27017/resumerocket-test"
    );
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should create a job with valid fields", async () => {
    const job = await jobModel.create({
      user_id: new mongoose.Types.ObjectId(),
      type: "resume-grade",
      status: "pending",
      input: { resume_id: "abc123" },
    });

    expect(job._id).toBeDefined();
    expect(job.type).toBe("resume-grade");
    expect(job.status).toBe("pending");
    expect(job.result).toBeUndefined();
    expect(job.error).toBeUndefined();
    expect(job.created_on).toBeDefined();
  });

  it("should reject invalid job type", async () => {
    await expect(
      jobModel.create({
        user_id: new mongoose.Types.ObjectId(),
        type: "invalid-type",
        status: "pending",
        input: {},
      })
    ).rejects.toThrow();
  });

  it("should reject invalid status", async () => {
    await expect(
      jobModel.create({
        user_id: new mongoose.Types.ObjectId(),
        type: "resume-grade",
        status: "invalid-status",
        input: {},
      })
    ).rejects.toThrow();
  });

  it("should require user_id", async () => {
    await expect(
      jobModel.create({
        type: "resume-grade",
        status: "pending",
        input: {},
      })
    ).rejects.toThrow();
  });

  it("should store result when completed", async () => {
    const job = await jobModel.create({
      user_id: new mongoose.Types.ObjectId(),
      type: "cover-letter",
      status: "completed",
      input: { resume_id: "abc123" },
      result: { cover_letter: "Dear hiring manager..." },
      completed_on: new Date(),
    });

    expect(job.result).toEqual({ cover_letter: "Dear hiring manager..." });
    expect(job.completed_on).toBeDefined();
  });

  it("should store error when failed", async () => {
    const job = await jobModel.create({
      user_id: new mongoose.Types.ObjectId(),
      type: "resume-grade",
      status: "failed",
      input: { resume_id: "abc123" },
      error: "OpenAI API timeout",
    });

    expect(job.error).toBe("OpenAI API timeout");
  });
});
