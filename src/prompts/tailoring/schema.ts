import { z } from 'zod';

const ExperienceEntry = z.object({
  companyName: z.string(),
  role: z.string(),
  tasks: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string(),
  isPresent: z.boolean(),
  location: z.string(),
  description: z.string(),
});

const EducationEntry = z.object({
  schoolName: z.string(),
  degree: z.string(),
  subject: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

const ProjectLinks = z.object({
  GitHub: z.string().optional(),
  Website: z.string().optional(),
});

const ProjectEntry = z.object({
  title: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string(),
  links: ProjectLinks.optional(),
});

export const TailoringResult = z.object({
  category: z.string(),
  name: z.string(),
  summary: z.string(),
  atsScore: z.number().min(0).max(100),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  skills: z.array(z.string()),
  experience: z.array(ExperienceEntry),
  education: z.array(EducationEntry),
  projects: z.array(ProjectEntry),
  achievements: z.array(z.string()),
  certifications: z.array(z.string()),
  languages: z.array(z.string()),
  interests: z.array(z.string()),
});

export type TailoringResult = z.infer<typeof TailoringResult>;
