// src/use_cases/resume_builder/get_by_id/dto.ts
import { IGetResumeDraftByIdRequest } from './request';
export interface IGetResumeDraftByIdDto { resume_draft_id: string }
export class GetResumeDraftByIdDtoConverter {
  private output_object: IGetResumeDraftByIdDto;
  constructor(data: IGetResumeDraftByIdRequest) {
    this.output_object = { resume_draft_id: data.resume_draft_id };
  }
  public getDtoObject(): IGetResumeDraftByIdDto { return this.output_object; }
}
