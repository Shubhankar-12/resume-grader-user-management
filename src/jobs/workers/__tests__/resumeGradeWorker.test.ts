import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  mockUpdateStatus,
  mockIncrementAttempts,
  mockGetReportByResumeId,
  mockCreate,
  mockGetExtractedResume,
  mockGenerateReport,
  mockRecordRefund,
  mockIncrementCreditBalance,
} = vi.hoisted(() => ({
  mockUpdateStatus: vi.fn(),
  mockIncrementAttempts: vi.fn(),
  mockGetReportByResumeId: vi.fn(),
  mockCreate: vi.fn(),
  mockGetExtractedResume: vi.fn(),
  mockGenerateReport: vi.fn(),
  mockRecordRefund: vi.fn(),
  mockIncrementCreditBalance: vi.fn(),
}));

vi.mock("../../../db/queries/JobQueries", () => ({
  jobQueries: {
    updateStatus: mockUpdateStatus,
    incrementAttempts: mockIncrementAttempts,
  },
}));

vi.mock("../../../db/queries", () => ({
  reportQueries: {
    getReportByResumeId: mockGetReportByResumeId,
    create: mockCreate,
  },
  extractedResumeQueries: {
    getExtractedResumebyResumeId: mockGetExtractedResume,
  },
  creditTransactionQueries: {
    recordRefund: mockRecordRefund,
  },
  userQueries: {
    incrementCreditBalance: mockIncrementCreditBalance,
  },
}));

vi.mock("../../../prompts", () => ({
  generateResumeReportFromExtractedText: mockGenerateReport,
}));

import { processResumeGradeJob } from "../resumeGradeWorker";

describe("Resume Grade Worker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should process a resume grade job successfully", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
    };

    mockGetReportByResumeId.mockResolvedValue([]);
    mockGetExtractedResume.mockResolvedValue([
      { extractedText: "John Doe, Software Engineer..." },
    ]);
    mockGenerateReport.mockResolvedValue({
      overallGrade: "B+",
      scoreOutOf100: 78,
      scoreBreakdown: { atsCompatibility: 80, keywordMatch: 75, contentQuality: 80, formatting: 77 },
      strengths: [],
      areasForImprovement: [],
      keywordAnalysis: { presentKeywords: [], missingKeywords: [] },
      actionableSuggestions: [],
      projectAnalysis: { strengths: [], areasForImprovement: [] },
      certificationAnalysis: { strengths: [], areasForImprovement: [], recommendedCertifications: [] },
      interestAnalysis: { relevance: 70, comments: "Good", suggestions: [] },
    });
    mockCreate.mockResolvedValue({
      _id: "report-001",
      resume_id: "resume-456",
      overallGrade: "B+",
      scoreOutOf100: 78,
    });

    await processResumeGradeJob(jobData);

    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "processing");
    expect(mockIncrementAttempts).toHaveBeenCalledWith("job-123");
    expect(mockGetExtractedResume).toHaveBeenCalledWith({ resume_id: "resume-456" });
    expect(mockGenerateReport).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalled();
    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "completed", {
      result: expect.objectContaining({
        report_id: "report-001",
        overallGrade: "B+",
      }),
    });
  });

  it("should mark job as failed when extracted resume not found", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
    };

    mockGetReportByResumeId.mockResolvedValue([]);
    mockGetExtractedResume.mockResolvedValue([]);

    await processResumeGradeJob(jobData);

    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "failed", {
      error: "Extracted resume not found",
    });
  });

  it("should skip if report already exists", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
    };

    mockGetReportByResumeId.mockResolvedValue([{ report_id: "existing-report" }]);

    await processResumeGradeJob(jobData);

    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "completed", {
      result: expect.objectContaining({ report_id: "existing-report" }),
    });
    expect(mockGenerateReport).not.toHaveBeenCalled();
  });

  it("should mark job as failed when AI throws an error", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
    };

    mockGetReportByResumeId.mockResolvedValue([]);
    mockGetExtractedResume.mockResolvedValue([
      { extractedText: "Some text" },
    ]);
    mockGenerateReport.mockRejectedValue(new Error("OpenAI API timeout"));

    await processResumeGradeJob(jobData);

    expect(mockUpdateStatus).toHaveBeenCalledWith("job-123", "failed", {
      error: "OpenAI API timeout",
    });
  });

  it("refunds credits when an infra error occurs and __credits present", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
      __credits: {
        userId: "user-789",
        cost: 3,
        action: "resume_grade" as const,
        preJobId: "pre-abc",
      },
    };

    mockGetReportByResumeId.mockResolvedValue([]);
    mockGetExtractedResume.mockResolvedValue([{ extractedText: "t" }]);
    mockGenerateReport.mockRejectedValue(new Error("OpenAI 503 Service Unavailable"));

    await processResumeGradeJob(jobData);

    expect(mockRecordRefund).toHaveBeenCalledWith("user-789", "pre-abc", 3);
    expect(mockIncrementCreditBalance).toHaveBeenCalledWith("user-789", 3);
  });

  it("does NOT refund credits for user-error failures", async () => {
    const jobData = {
      jobId: "job-123",
      resume_id: "resume-456",
      user_id: "user-789",
      __credits: {
        userId: "user-789",
        cost: 3,
        action: "resume_grade" as const,
        preJobId: "pre-abc",
      },
    };

    mockGetReportByResumeId.mockResolvedValue([]);
    mockGetExtractedResume.mockResolvedValue([{ extractedText: "t" }]);
    mockGenerateReport.mockRejectedValue(new Error("resume content invalid"));

    await processResumeGradeJob(jobData);

    expect(mockRecordRefund).not.toHaveBeenCalled();
    expect(mockIncrementCreditBalance).not.toHaveBeenCalled();
  });
});
