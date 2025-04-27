import { IDisableUserResumeRequest } from "./request";

export interface IDisableUserResumeDto {
  resume_id: string;

  status?: string;
}

export class DisableUserResumeDtoConverter {
  private output_object: IDisableUserResumeDto;
  constructor(data: IDisableUserResumeRequest) {
    this.output_object = {
      resume_id: data.resume_id,
      status: data.status ? data.status : "DISABLED",
    };
  }
  public getDtoObject(): IDisableUserResumeDto {
    return this.output_object;
  }
}
