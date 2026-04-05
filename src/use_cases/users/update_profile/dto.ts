import { IUpdateProfileRequest } from './request';

export interface IUpdateProfileDto {
  user_id: string;
  career_goal?: string;
  target_role?: string;
  onboarding_completed?: boolean;
  name?: string;
}

export class UpdateProfileDtoConverter {
  private output_object: IUpdateProfileDto;

  constructor(data: IUpdateProfileRequest) {
    this.output_object = {
      user_id: data.user_id,
      career_goal: data.career_goal !== undefined ? data.career_goal : undefined,
      target_role: data.target_role !== undefined ? data.target_role : undefined,
      onboarding_completed:
        data.onboarding_completed !== undefined
          ? data.onboarding_completed
          : undefined,
      name: data.name !== undefined ? data.name : undefined,
    };
  }

  public getDtoObject(): IUpdateProfileDto {
    return this.output_object;
  }
}
