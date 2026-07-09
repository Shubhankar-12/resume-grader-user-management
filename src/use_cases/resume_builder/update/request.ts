// src/use_cases/resume_builder/update/request.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUpdateResumeDraftRequest {
  resume_draft_id: string;
  patch: Record<string, any>;
}
