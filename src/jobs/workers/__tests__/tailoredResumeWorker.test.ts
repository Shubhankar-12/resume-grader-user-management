import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  mockUpdateStatus,
  mockIncrementAttempts,
  mockGetExtractedResume,
  mockGenerateTailoredResume,
  mockCreateTailoredResume,
} = vi.hoisted(() => ({
  mockUpdateStatus: vi.fn(),
  mockIncrementAttempts: vi.fn(),
  mockGetExtractedResume: vi.fn(),
  mockGenerateTailoredResume: vi.fn(),
  mockCreateTailoredResume: vi.fn(),
}));

vi.mock("../../../db/queries/JobQueries", () => ({
  jobQueries: {
    updateStatus: mockUpdateStatus,
    incrementAttempts: mockIncrementAttempts,
  },
}));

vi.mock("../../../db/queries", () => ({
  extractedResumeQueries: {
    getExtractedResumebyResumeId: mockGetExtractedResume,
  },
  tailoredResumeQueries: { create: mockCreateTailoredResume },
}));

vi.mock("../../../prompts", () => ({
  generateTailoredResume: mockGenerateTailoredResume,
}));

import { processTailoredResumeJob } from "../tailoredResumeWorker";

describe("Tailored Resume Worker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should process a tailored resume job successfully", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
      job_description: "We need a senior full-stack developer...",
    };

    mockGetExtractedResume.mockResolvedValue([
      { extractedText: "John Doe, Software Engineer..." },
    ]);
    mockGenerateTailoredResume.mockResolvedValue({
      name: "John Doe",
      summary: "Tailored summary...",
      atsScore: 92,
      skills: ["React", "Node.js"],
    });
    mockCreateTailoredResume.mockResolvedValue({
      _id: "tailored-001",
      atsScore: 92,
    });

    await processTailoredResumeJob(jobData);

    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "processing");
    expect(mockIncrementAttempts).toHaveBeenCalledWith("job-123");
    expect(mockGetExtractedResume).toHaveBeenCalledWith({
      resume_id: "resume-456",
    });
    expect(mockGenerateTailoredResume).toHaveBeenCalledWith(
      { extractedText: "John Doe, Software Engineer..." },
      "We need a senior full-stack developer..."
    );
    expect(mockCreateTailoredResume).toHaveBeenCalled();
    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "completed", {
      result: expect.objectContaining({
        tailored_resume_id: "tailored-001",
        atsScore: 92,
      }),
    });
  });

  it("should mark job as failed when extracted resume not found", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
      job_description: "desc",
    };

    mockGetExtractedResume.mockResolvedValue([]);

    await processTailoredResumeJob(jobData);

    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "failed", {
      error: "Extracted resume not found",
    });
  });

  it("should mark job as failed when AI throws an error", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
      job_description: "desc",
    };

    mockGetExtractedResume.mockResolvedValue([{ extractedText: "text" }]);
    mockGenerateTailoredResume.mockRejectedValue(
      new Error("OpenAI API timeout")
    );

    await processTailoredResumeJob(jobData);

    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "failed", {
      error: "OpenAI API timeout",
    });
  });
});
