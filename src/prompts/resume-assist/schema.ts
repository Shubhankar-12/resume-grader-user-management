import { z } from 'zod';

export const ImprovedBulletResult = z.object({ bullet: z.string() });
export type ImprovedBulletResult = z.infer<typeof ImprovedBulletResult>;

export const ResumeSummaryResult = z.object({ summary: z.string() });
export type ResumeSummaryResult = z.infer<typeof ResumeSummaryResult>;

export const SkillSuggestionResult = z.object({ skills: z.array(z.string()) });
export type SkillSuggestionResult = z.infer<typeof SkillSuggestionResult>;
