import { ICreateReportRequest } from './request';

export interface ICreateReportDto {
  resume_id: string;
  user_id: string;
}

export class CreateReportDtoConverter {
  private output_object: ICreateReportDto;
  constructor(data: ICreateReportRequest, userId: string) {
    this.output_object = { resume_id: data.resume_id, user_id: userId };
  }
  public getDtoObject(): ICreateReportDto {
    return this.output_object;
  }
}
