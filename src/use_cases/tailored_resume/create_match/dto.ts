import { ICreateMatchReportRequest } from "./request";

export interface ICreateMatchReportDto {
  resume_id: string;
  job_description: string;
}

export class CreateMatchReportDtoConverter {
  private output_object: ICreateMatchReportDto;
  constructor(data: ICreateMatchReportRequest) {
    this.output_object = {
      resume_id: data.resume_id,
      job_description: data.job_description,
    };
  }
  public getDtoObject(): ICreateMatchReportDto {
    return this.output_object;
  }
}
