import { ICreateApplicationRequest } from './request';

export interface ICreateApplicationDto {
  user_id: string;
  company: string;
  role: string;
  job_url: string;
  job_description: string;
  notes: string;
  status: string;
  applied_date: Date | null;
  resume_id: string | null;
  cover_letter_id: string | null;
}

export class CreateApplicationDtoConverter {
  private output_object: ICreateApplicationDto;
  constructor(data: ICreateApplicationRequest) {
    this.output_object = {
      user_id: data.user_id,
      company: data.company,
      role: data.role,
      job_url: data.job_url ?? '',
      job_description: data.job_description ?? '',
      notes: data.notes ?? '',
      status: data.status ?? 'BOOKMARKED',
      applied_date: data.applied_date ? new Date(data.applied_date) : null,
      resume_id: data.resume_id ?? null,
      cover_letter_id: data.cover_letter_id ?? null,
    };
  }
  public getDtoObject(): ICreateApplicationDto {
    return this.output_object;
  }
}
