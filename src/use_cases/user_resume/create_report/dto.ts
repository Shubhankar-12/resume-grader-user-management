import { ICreateReportRequest } from "./request";

export interface ICreateReportDto {
  resume_id: string;
}

export class CreateReportDtoConverter {
  private output_object: ICreateReportDto;
  constructor(data: ICreateReportRequest) {
    this.output_object = {
      resume_id: data.resume_id,
    };
  }
  public getDtoObject(): ICreateReportDto {
    return this.output_object;
  }
}
