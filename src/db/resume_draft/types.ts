import { Document, Model } from 'mongoose';

// Default order tells the candidate's story for a fast recruiter scan.
export const SECTION_KEYS = [
  'summary', 'experience', 'skills', 'projects', 'education',
  'awards', 'publications', 'volunteer', 'activities',
  'certifications', 'languages', 'interests',
] as const;
export type SectionKey = typeof SECTION_KEYS[number];

export const TEMPLATE_IDS = [
  'classic', 'modern', 'compact',
  'coursework-classic', 'tri-header', 'faangpath', 'deedy',
  'emoji', 'jake', 'business-pro', 'modern-tech',
] as const;
export type TemplateId = typeof TEMPLATE_IDS[number];

export interface ILink { label: string; url: string }

export type SkillLevel = 'expert' | 'proficient' | 'intermediate' | 'beginner';
export interface ISkillItem { name: string; level?: SkillLevel }
export interface ISkillGroup { id: string; category: string; skills: ISkillItem[] }

export type LanguageLevel =
  | 'native' | 'fluent' | 'professional' | 'intermediate' | 'basic';
export interface ILanguageItem { id: string; name: string; level?: LanguageLevel }

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
  gpa: string; honors: string; coursework: string[];
}
export interface IDraftProject {
  id: string; title: string; description: string;
  technologies: string[]; links: ILink[];
}
export interface IDraftCertification {
  id: string; name: string; issuer: string; date: string; url: string;
}
export interface IDraftAward {
  id: string; name: string; issuer: string; date: string; description: string;
}
export interface IDraftPublication {
  id: string; title: string; publisher: string; date: string; url: string; description: string;
}
export interface IDraftVolunteer {
  id: string; role: string; organization: string; location: string;
  startDate: string; endDate: string; isPresent: boolean; description: string;
}
export interface IDraftActivity {
  id: string; title: string; organization: string; date: string; description: string;
}

export interface IResumeDraft {
  user_id: string;
  title: string;
  template_id: TemplateId;
  accent_color: string;
  basics: {
    name: string; headline: string; email: string; phone: string; location: string;
    links: ILink[]; photoUrl: string;
  };
  summary: string;
  skills: string[];
  skillGroups: ISkillGroup[];
  languages: string[];
  languageItems: ILanguageItem[];
  interests: string[];
  experience: IDraftExperience[];
  education: IDraftEducation[];
  projects: IDraftProject[];
  certifications: IDraftCertification[];
  awards: IDraftAward[];
  publications: IDraftPublication[];
  volunteer: IDraftVolunteer[];
  activities: IDraftActivity[];
  section_order: string[];
  status_field: 'ENABLED' | 'DISABLED';
}

export interface IResumeDraftDocument extends IResumeDraft, Document {}
export type IResumeDraftModel = Model<IResumeDraftDocument>;
