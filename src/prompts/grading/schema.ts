import { z } from 'zod';

export const GradingSuggestion = z.object({
  title: z.string(),
  description: z.string(),
});

export const GradingResult = z.object({
  gradingScore: z.number().min(0).max(100),
  atsScore: z.number().min(0).max(100),
  suggestions: z.array(GradingSuggestion),
});

export type GradingResult = z.infer<typeof GradingResult>;
