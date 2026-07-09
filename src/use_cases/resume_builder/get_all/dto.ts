// src/use_cases/resume_builder/get_all/dto.ts
import { IGetAllResumeDraftsRequest } from './request';
export interface IGetAllResumeDraftsDto { user_id: string }
export class GetAllResumeDraftsDtoConverter {
  private output_object: IGetAllResumeDraftsDto;
  constructor(data: IGetAllResumeDraftsRequest) {
    this.output_object = { user_id: data.user_id };
  }
  public getDtoObject(): IGetAllResumeDraftsDto { return this.output_object; }
}
