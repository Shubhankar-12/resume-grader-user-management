import { z } from 'zod';

export const CoverLetterResult = z.object({
  cover_letter: z.string(),
  cover_letter_summary: z.string(),
});

export type CoverLetterResult = z.infer<typeof CoverLetterResult>;
