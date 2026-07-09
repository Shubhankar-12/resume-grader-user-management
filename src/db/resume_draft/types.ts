import { Document, Model } from 'mongoose';

// Default order tells the candidate's story for a fast recruiter scan:
// pitch -> experience -> skills -> proof -> credentials.
export const SECTION_KEYS = [
  'summary', 'experience', 'skills', 'projects',
  'education', 'certifications', 'languages', 'interests',
] as const;
export type SectionKey = typeof SECTION_KEYS[number];

export const TEMPLATE_IDS = ['classic', 'modern', 'compact'] as const;
export type TemplateId = typeof TEMPLATE_IDS[number];

export interface ILink { label: string; url: string }

export interface IDraftExperience {
  id: string; role: string; companyName: string; location: string;
  startDate: string; endDate: string; isPresent: boolean;
  bullets: string[];
  /** Rich-text (sanitized HTML) description; preferred over bullets when set. */
  description: string;
}
export interface IDraftEducation {
  id: string; degree: string; subject: string; schoolName: string;
  location: string; startDate: string; endDate: string;
}
export interface IDraftProject {
  id: string; title: string; description: string;
  technologies: string[]; links: ILink[];
}
export interface IDraftCertification {
  id: string; name: string; issuer: string; date: string; url: string;
}

export interface IResumeDraft {
  user_id: string;
  title: string;
  template_id: TemplateId;
  accent_color: string;
  basics: {
    name: string; headline: string; email: string; phone: string; location: string;
    links: ILink[];
  };
  summary: string;
  skills: string[];
  languages: string[];
  interests: string[];
  experience: IDraftExperience[];
  education: IDraftEducation[];
  projects: IDraftProject[];
  certifications: IDraftCertification[];
  section_order: string[];
  status_field: 'ENABLED' | 'DISABLED';
}

export interface IResumeDraftDocument extends IResumeDraft, Document {}
export type IResumeDraftModel = Model<IResumeDraftDocument>;
