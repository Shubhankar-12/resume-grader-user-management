import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGetByIdAndUserId } = vi.hoisted(() => ({
  mockGetByIdAndUserId: vi.fn(),
}));

vi.mock("../../../../db/queries/JobQueries", () => ({
  jobQueries: {
    getByIdAndUserId: mockGetByIdAndUserId,
  },
}));

vi.mock("../../../../logger", () => ({
  logUnexpectedUsecaseError: () => () => {},
}));

import { GetJobStatusUseCase } from "../usecase";

describe("GetJobStatusUseCase", () => {
  const useCase = new GetJobStatusUseCase();

  beforeEach(() => { vi.clearAllMocks(); });

  it("should return job status when job exists", async () => {
    mockGetByIdAndUserId.mockResolvedValue({
      _id: "job-123", user_id: "user-456", type: "resume-grade",
      status: "processing", input: { resume_id: "r-1" }, attempts: 1,
      created_on: new Date("2026-03-29"),
    });
    const result = await useCase.execute({ job_id: "job-123", user_id: "user-456" });
    expect(result.isSuccessClass()).toBe(true);
    expect(result.value).toEqual(expect.objectContaining({ job_id: "job-123", type: "resume-grade", status: "processing" }));
  });

  it("should return completed job with result", async () => {
    mockGetByIdAndUserId.mockResolvedValue({
      _id: "job-123", user_id: "user-456", type: "resume-grade", status: "completed",
      input: {}, result: { report_id: "rpt-001", overallGrade: "A" },
      attempts: 1, completed_on: new Date(), created_on: new Date(),
    });
    const result = await useCase.execute({ job_id: "job-123", user_id: "user-456" });
    expect(result.isSuccessClass()).toBe(true);
    expect(result.value).toEqual(expect.objectContaining({ status: "completed", result: { report_id: "rpt-001", overallGrade: "A" } }));
  });

  it("should return error when job not found", async () => {
    mockGetByIdAndUserId.mockResolvedValue(null);
    const result = await useCase.execute({ job_id: "nonexistent", user_id: "user-456" });
    expect(result.isErrClass()).toBe(true);
  });

  it("should return failed job with error message", async () => {
    mockGetByIdAndUserId.mockResolvedValue({
      _id: "job-123", user_id: "user-456", type: "cover-letter", status: "failed",
      input: {}, error: "OpenAI timeout", attempts: 3,
      completed_on: new Date(), created_on: new Date(),
    });
    const result = await useCase.execute({ job_id: "job-123", user_id: "user-456" });
    expect(result.isSuccessClass()).toBe(true);
    expect(result.value).toEqual(expect.objectContaining({ status: "failed", error: "OpenAI timeout" }));
  });
});
