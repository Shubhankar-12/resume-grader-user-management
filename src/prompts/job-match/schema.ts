import { z } from 'zod';

export const JobMatchResult = z.object({
  keyRequirements: z.object({
    requiredSkills: z.array(z.string()),
    experienceLevel: z.string(),
    education: z.string(),
    keyResponsibilities: z.array(z.string()),
  }),
  resumeMatchAnalysis: z.object({
    overallMatch: z.number().min(0).max(100),
    matchingSkills: z.array(z.string()),
    missingSkills: z.array(z.string()),
    experienceMatch: z.object({ isMatching: z.boolean(), message: z.string() }),
    educationMatch: z.object({ isMatching: z.boolean(), message: z.string() }),
    projectsMatch: z.object({ isMatching: z.boolean(), message: z.string(), relevantProjects: z.array(z.string()) }),
    certificationMatch: z.object({
      isMatching: z.boolean(),
      message: z.string(),
      relevantCertifications: z.array(z.string()),
      recommendedCertifications: z.array(z.string()),
    }),
  }),
});

export type JobMatchResult = z.infer<typeof JobMatchResult>;
