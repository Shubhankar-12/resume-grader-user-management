import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  mockUpdateStatus,
  mockIncrementAttempts,
  mockGetExtractedResume,
  mockGenerateCoverLetter,
  mockCreateCoverLetter,
} = vi.hoisted(() => ({
  mockUpdateStatus: vi.fn(),
  mockIncrementAttempts: vi.fn(),
  mockGetExtractedResume: vi.fn(),
  mockGenerateCoverLetter: vi.fn(),
  mockCreateCoverLetter: vi.fn(),
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
  coverLetterQueries: { create: mockCreateCoverLetter },
}));

vi.mock("../../../helpers/resumeAnalyzerAI", () => ({
  generateResumeCoverLetterFromExtractedText: mockGenerateCoverLetter,
}));

import { processCoverLetterJob } from "../coverLetterWorker";

describe("Cover Letter Worker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should process a cover letter job successfully", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
      role: "Software Engineer",
      company: "Acme Corp",
      job_description: "We need a senior dev...",
    };

    mockGetExtractedResume.mockResolvedValue([
      { extractedText: "John Doe..." },
    ]);
    mockGenerateCoverLetter.mockResolvedValue({
      cover_letter: "Dear Hiring Manager...",
      cover_letter_summary: "Experienced engineer...",
    });
    mockCreateCoverLetter.mockResolvedValue({
      _id: "cl-001",
      cover_letter: "Dear Hiring Manager...",
      cover_letter_summary: "Experienced engineer...",
    });

    await processCoverLetterJob(jobData);

    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "processing");
    expect(mockIncrementAttempts).toHaveBeenCalledWith("job-123");
    expect(mockGetExtractedResume).toHaveBeenCalledWith({
      resume_id: "resume-456",
    });
    expect(mockGenerateCoverLetter).toHaveBeenCalledWith(
      { extractedText: "John Doe..." },
      "We need a senior dev...",
      "Software Engineer",
      "Acme Corp"
    );
    expect(mockCreateCoverLetter).toHaveBeenCalled();
    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "completed", {
      result: expect.objectContaining({ cover_letter_id: "cl-001" }),
    });
  });

  it("should mark job as failed when extracted resume not found", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
      role: "Engineer",
      company: "Acme",
      job_description: "desc",
    };

    mockGetExtractedResume.mockResolvedValue([]);

    await processCoverLetterJob(jobData);

    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "failed", {
      error: "Extracted resume not found",
    });
  });

  it("should mark job as failed when AI returns empty result", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
      role: "Engineer",
      company: "Acme",
      job_description: "desc",
    };

    mockGetExtractedResume.mockResolvedValue([{ extractedText: "text" }]);
    mockGenerateCoverLetter.mockResolvedValue(null);

    await processCoverLetterJob(jobData);

    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "failed", {
      error: "AI cover letter generation returned empty result",
    });
  });

  it("should mark job as failed when AI throws an error", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
      role: "Engineer",
      company: "Acme",
      job_description: "desc",
    };

    mockGetExtractedResume.mockResolvedValue([{ extractedText: "text" }]);
    mockGenerateCoverLetter.mockRejectedValue(new Error("API error"));

    await processCoverLetterJob(jobData);

    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "failed", {
      error: "API error",
    });
  });
});
