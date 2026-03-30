import { IGetJobStatusQuery } from './request';

export interface IGetJobStatusDto {
  job_id: string;
  user_id: string;
}

export class GetJobStatusDtoConverter {
  private output_object: IGetJobStatusDto;
  constructor(query: IGetJobStatusQuery, user_id: string) {
    this.output_object = { job_id: query.job_id, user_id };
  }
  public getDtoObject(): IGetJobStatusDto {
    return this.output_object;
  }
}
