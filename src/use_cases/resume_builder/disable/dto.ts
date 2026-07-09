// src/use_cases/resume_builder/disable/dto.ts
import { IDisableResumeDraftRequest } from './request';
export interface IDisableResumeDraftDto { resume_draft_id: string; user_id: string }
export class DisableResumeDraftDtoConverter {
  private output_object: IDisableResumeDraftDto;
  constructor(data: IDisableResumeDraftRequest) {
    this.output_object = { resume_draft_id: data.resume_draft_id, user_id: data.user_id };
  }
  public getDtoObject(): IDisableResumeDraftDto { return this.output_object; }
}
