import { ApplicationStatus } from '../../../db/application/types';
import { IReorderApplicationRequest } from './request';

export interface IReorderApplicationDto {
  application_id: string;
  new_status: ApplicationStatus;
  new_position: number;
  user_id: string;
}

export class ReorderApplicationDtoConverter {
  private output_object: IReorderApplicationDto;
  constructor(data: IReorderApplicationRequest) {
    this.output_object = {
      application_id: data.application_id,
      new_status: data.new_status as ApplicationStatus,
      new_position: Number(data.new_position),
      user_id: data.user_id,
    };
  }
  public getDtoObject(): IReorderApplicationDto {
    return this.output_object;
  }
}
