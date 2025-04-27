import { ICreateTailoredResumeRequest } from "./request";

export interface ICreateTailoredResumeDto {
  resume_id: string;
  job_description: string;
}

export class CreateTailoredResumeDtoConverter {
  private output_object: ICreateTailoredResumeDto;
  constructor(data: ICreateTailoredResumeRequest) {
    this.output_object = {
      resume_id: data.resume_id,
      job_description: data.job_description,
    };
  }
  public getDtoObject(): ICreateTailoredResumeDto {
    return this.output_object;
  }
}
