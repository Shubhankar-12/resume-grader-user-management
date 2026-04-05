/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICreateApplicationRequest {
  user_id: string;
  company: string;
  role: string;
  job_url?: string;
  job_description?: string;
  notes?: string;
  status?: string;
  applied_date?: string | null;
  resume_id?: string | null;
  cover_letter_id?: string | null;
}
