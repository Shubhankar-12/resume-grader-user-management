/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUpdateCoverLetterRequest {
  cover_letter_id: string;
  user_id?: string;
  resume_id?: string;
  job_description?: string;
  role?: string;
  company?: string;
  status?: string;
}
