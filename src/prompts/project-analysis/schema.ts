import { z } from 'zod';

export const ProjectAnalysisItem = z.object({
  id: z.number(),
  ai_score: z.number().min(0).max(100),
  relevance: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  reason: z.string(),
  key_points: z.array(z.string()),
});

export const ProjectAnalysisResult = z.union([
  z.array(ProjectAnalysisItem),
  z.object({ projects: z.array(ProjectAnalysisItem) }),
]);

export type ProjectAnalysisItem = z.infer<typeof ProjectAnalysisItem>;
export type ProjectAnalysisResult = z.infer<typeof ProjectAnalysisResult>;
