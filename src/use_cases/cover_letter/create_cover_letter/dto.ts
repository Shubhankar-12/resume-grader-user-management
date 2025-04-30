import { ICreateCoverLetterRequest } from "./request";

export interface ICreateCoverLetterDto {
  user_id: string;
  resume_id: string;
  job_description: string;
  role: string;
  company: string;
}

export class CreateCoverLetterDtoConverter {
  private output_object: ICreateCoverLetterDto;
  constructor(data: ICreateCoverLetterRequest) {
    this.output_object = {
      resume_id: data.resume_id,
      user_id: data.user_id,
      job_description: data.job_description,
      role: data.role,
      company: data.company,
    };
  }
  public getDtoObject(): ICreateCoverLetterDto {
    return this.output_object;
  }
}
