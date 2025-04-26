import { ICreateUserResumeRequest } from "./request";

export interface ICreateUserResumeDto {
  user_id: string;
  resume: {
    name: string;
    url: string;
    mimetype: string;
  };
  extractedText?: string;
  analysis?: {
    gradingScore: number;
    atsScore: number;
    suggestions: string[];
  };

  status?: string;
}

export class CreateUserResumeDtoConverter {
  private output_object: ICreateUserResumeDto;
  constructor(data: ICreateUserResumeRequest) {
    this.output_object = {
      user_id: data.user_id,
      resume: data.resume,
      extractedText: data.extractedText ? data.extractedText : undefined,
      analysis: data.analysis ? data.analysis : undefined,
      status: data.status ? data.status : "ENABLED",
    };
  }
  public getDtoObject(): ICreateUserResumeDto {
    return this.output_object;
  }
}
