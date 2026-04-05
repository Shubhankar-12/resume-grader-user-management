import { IUpdateApplicationRequest } from './request';

export interface IUpdateApplicationDto {
  application_id: string;
  company?: string;
  role?: string;
  job_url?: string;
  job_description?: string;
  notes?: string;
  applied_date?: Date | null;
  resume_id?: string | null;
  cover_letter_id?: string | null;
}

export class UpdateApplicationDtoConverter {
  private output_object: IUpdateApplicationDto;
  constructor(data: IUpdateApplicationRequest) {
    this.output_object = {
      application_id: data.application_id,
      company: data.company !== undefined ? data.company : undefined,
      role: data.role !== undefined ? data.role : undefined,
      job_url: data.job_url !== undefined ? data.job_url : undefined,
      job_description:
        data.job_description !== undefined ? data.job_description : undefined,
      notes: data.notes !== undefined ? data.notes : undefined,
      applied_date:
        data.applied_date !== undefined
          ? data.applied_date
            ? new Date(data.applied_date)
            : null
          : undefined,
      resume_id: data.resume_id !== undefined ? data.resume_id : undefined,
      cover_letter_id:
        data.cover_letter_id !== undefined ? data.cover_letter_id : undefined,
    };
  }
  public getDtoObject(): IUpdateApplicationDto {
    return this.output_object;
  }
}
