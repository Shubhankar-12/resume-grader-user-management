import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock OpenAI before importing
const { mockCreate } = vi.hoisted(() => {
  const mockCreate = vi.fn();
  return { mockCreate };
});

vi.mock("openai", () => {
  class MockOpenAI {
    chat = {
      completions: {
        create: mockCreate,
      },
    };
  }
  return { default: MockOpenAI };
});

// Mock aiCostLogger
vi.mock("../aiCostLogger", () => ({
  logAICost: vi.fn(),
}));

// Mock logger
vi.mock("../../logger/Config", () => ({
  makeLogger: vi.fn().mockReturnValue({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  }),
}));

import { getResumeScoreAndSuggestions } from "../resumeAnalyzerAI";
import { logAICost } from "../aiCostLogger";

describe("resumeAnalyzerAI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should use response_format json_object in API call", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              gradingScore: 80,
              atsScore: 75,
              suggestions: [],
            }),
          },
        },
      ],
      usage: { prompt_tokens: 100, completion_tokens: 50 },
    });

    await getResumeScoreAndSuggestions("Some resume text");

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        response_format: { type: "json_object" },
      })
    );
  });

  it("should call logAICost after each completion", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              gradingScore: 85,
              atsScore: 90,
              suggestions: [{ title: "Fix", description: "Something" }],
            }),
          },
        },
      ],
      usage: { prompt_tokens: 200, completion_tokens: 100 },
    });

    await getResumeScoreAndSuggestions("Another resume text");

    expect(logAICost).toHaveBeenCalledTimes(1);
    expect(logAICost).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: "getResumeScoreAndSuggestions",
        model: "gpt-4o-mini",
        inputTokens: 200,
        outputTokens: 100,
      })
    );
  });

  it("should throw error when AI returns bad JSON", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: "This is not valid JSON {{{",
          },
        },
      ],
      usage: { prompt_tokens: 100, completion_tokens: 50 },
    });

    await expect(
      getResumeScoreAndSuggestions("Resume with bad response")
    ).rejects.toThrow("Invalid AI Grading Response Format");
  });
});
