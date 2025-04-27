import { IGetReportQuery } from "./request";

export interface IGetReportDto {
  resume_id: string;
}

export class GetReportDtoConverter {
  private output_object: IGetReportDto;
  constructor(query: IGetReportQuery) {
    this.output_object = {
      resume_id: query.resume_id,
    };
  }
  public getDtoObject(): IGetReportDto {
    return this.output_object;
  }
}
