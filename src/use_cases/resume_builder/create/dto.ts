// src/use_cases/resume_builder/create/dto.ts
import { ICreateResumeDraftRequest } from './request';

export interface ICreateResumeDraftDto {
  user_id: string;
  title: string;
  template_id: 'classic' | 'modern' | 'compact';
  seed_from_resume_id: string | null;
}

export class CreateResumeDraftDtoConverter {
  private output_object: ICreateResumeDraftDto;
  constructor(data: ICreateResumeDraftRequest) {
    this.output_object = {
      user_id: data.user_id,
      title: data.title ?? 'Untitled resume',
      template_id: data.template_id ?? 'classic',
      seed_from_resume_id: data.seed_from_resume_id ?? null,
    };
  }
  public getDtoObject(): ICreateResumeDraftDto {
    return this.output_object;
  }
}
