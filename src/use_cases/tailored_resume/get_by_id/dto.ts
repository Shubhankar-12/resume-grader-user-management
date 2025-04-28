import { IGetTailoredResumeQuery } from "./request";

export interface IGetTailoredResumeDto {
  tailored_resume_id: string;
}

export class GetTailoredResumeDtoConverter {
  private output_object: IGetTailoredResumeDto;
  constructor(query: IGetTailoredResumeQuery) {
    this.output_object = {
      tailored_resume_id: query.tailored_resume_id,
    };
  }
  public getDtoObject(): IGetTailoredResumeDto {
    return this.output_object;
  }
}
