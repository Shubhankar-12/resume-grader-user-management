import { z } from 'zod';

const TitleDescription = z.object({ title: z.string(), description: z.string() });
const ActionableSuggestion = z.object({ title: z.string(), description: z.string(), block: z.string() });

export const ReportResult = z.object({
  overallGrade: z.string(),
  scoreOutOf100: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    atsCompatibility: z.number(),
    keywordMatch: z.number(),
    contentQuality: z.number(),
    formatting: z.number(),
  }),
  strengths: z.array(TitleDescription),
  areasForImprovement: z.array(TitleDescription),
  keywordAnalysis: z.object({
    presentKeywords: z.array(z.string()),
    missingKeywords: z.array(z.string()),
  }),
  projectAnalysis: z.object({
    strengths: z.array(TitleDescription),
    areasForImprovement: z.array(TitleDescription),
  }),
  certificationAnalysis: z.object({
    strengths: z.array(TitleDescription),
    areasForImprovement: z.array(TitleDescription),
    recommendedCertifications: z.array(z.string()),
  }),
  interestAnalysis: z.object({
    relevance: z.number(),
    comments: z.string(),
    suggestions: z.array(z.string()),
  }),
  actionableSuggestions: z.array(ActionableSuggestion),
});

export type ReportResult = z.infer<typeof ReportResult>;
