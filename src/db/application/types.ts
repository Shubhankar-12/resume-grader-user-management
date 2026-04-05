import { Document, Model } from 'mongoose';

export const APPLICATION_STATUSES = [
  'BOOKMARKED', 'APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED',
] as const;

export type ApplicationStatus = typeof APPLICATION_STATUSES[number];

export interface IApplication {
  user_id: string;
  company: string;
  role: string;
  job_url: string;
  job_description: string;
  status: ApplicationStatus;
  position: number;
  notes: string;
  applied_date: Date | null;
  resume_id: string | null;
  cover_letter_id: string | null;
  status_field: 'ENABLED' | 'DISABLED';
}

export interface IApplicationDocument extends IApplication, Document {}
export type IApplicationModel = Model<IApplicationDocument>;
