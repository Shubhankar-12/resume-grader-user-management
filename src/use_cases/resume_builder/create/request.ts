// src/use_cases/resume_builder/create/request.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICreateResumeDraftRequest {
  user_id: string;
  title?: string;
  template_id?: 'classic' | 'modern' | 'compact';
  seed_from_resume_id?: string | null;
}
