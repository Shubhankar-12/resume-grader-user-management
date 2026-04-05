import { z } from 'zod';

export const ExtractionResult = z.object({
  category: z.string(),
  name: z.string(),
  summary: z.string().optional().default(''),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  location: z.string().optional().default(''),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      companyName: z.string(),
      role: z.string(),
      tasks: z.array(z.string()),
      startDate: z.string().optional().default(''),
      endDate: z.string().optional().default(''),
      isPresent: z.boolean().optional().default(false),
      location: z.string().optional().default(''),
      description: z.string().optional().default(''),
    })
  ),
  education: z.array(
    z.object({
      schoolName: z.string(),
      degree: z.string().optional().default(''),
      subject: z.string().optional().default(''),
      location: z.string().optional().default(''),
      startDate: z.string().optional().default(''),
      endDate: z.string().optional().default(''),
    })
  ),
  projects: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional().default(''),
        technologies: z.array(z.string()).optional().default([]),
        startDate: z.string().optional().default(''),
        endDate: z.string().optional().default(''),
        links: z
          .object({
            GitHub: z.string().optional().default(''),
            Website: z.string().optional().default(''),
          })
          .optional()
          .default({}),
      })
    )
    .optional()
    .default([]),
  achievements: z.array(z.string()).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
  interests: z.array(z.string()).optional().default([]),
});

export type ExtractionResult = z.infer<typeof ExtractionResult>;
