import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  mockUpdateStatus,
  mockIncrementAttempts,
  mockGetReportByResumeId,
  mockCreate,
  mockGetExtractedResume,
  mockGenerateReport,
} = vi.hoisted(() => ({
  mockUpdateStatus: vi.fn(),
  mockIncrementAttempts: vi.fn(),
  mockGetReportByResumeId: vi.fn(),
  mockCreate: vi.fn(),
  mockGetExtractedResume: vi.fn(),
  mockGenerateReport: vi.fn(),
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
}));

vi.mock("../../../helpers/resumeAnalyzerAI", () => ({
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
});
