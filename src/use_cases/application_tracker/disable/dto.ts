import { IDisableApplicationRequest } from './request';

export interface IDisableApplicationDto {
  application_id: string;
  user_id: string;
}

export class DisableApplicationDtoConverter {
  private output_object: IDisableApplicationDto;
  constructor(data: IDisableApplicationRequest) {
    this.output_object = {
      application_id: data.application_id,
      user_id: data.user_id,
    };
  }
  public getDtoObject(): IDisableApplicationDto {
    return this.output_object;
  }
}
