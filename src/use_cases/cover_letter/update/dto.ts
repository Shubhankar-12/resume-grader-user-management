import { IUpdateCoverLetterRequest } from "./request";

export interface IUpdateCoverLetterDto {
  cover_letter_id: string;

  user_id?: string;
  resume_id?: string;
  job_description?: string;
  role?: string;
  company?: string;
  status?: string;
}

export class UpdateCoverLetterDtoConverter {
  private output_object: IUpdateCoverLetterDto;
  constructor(data: IUpdateCoverLetterRequest) {
    this.output_object = {
      cover_letter_id: data.cover_letter_id,
      user_id: data.user_id ? data.user_id : undefined,
      resume_id: data.resume_id ? data.resume_id : undefined,
      job_description: data.job_description ? data.job_description : undefined,
      role: data.role ? data.role : undefined,
      company: data.company ? data.company : undefined,
      status: data.status ? data.status : undefined,
    };
  }
  public getDtoObject(): IUpdateCoverLetterDto {
    return this.output_object;
  }
}
