// src/use_cases/resume_builder/update/dto.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUpdateResumeDraftRequest } from './request';

export const EDITABLE_FIELDS = [
  'title', 'template_id', 'accent_color', 'basics', 'summary',
  'skills', 'skillGroups', 'languages', 'languageItems', 'interests',
  'experience', 'education', 'projects', 'certifications',
  'awards', 'publications', 'volunteer', 'activities', 'section_order',
];

export interface IUpdateResumeDraftDto {
  resume_draft_id: string;
  patch: Record<string, any>;
}
export class UpdateResumeDraftDtoConverter {
  private output_object: IUpdateResumeDraftDto;
  constructor(data: IUpdateResumeDraftRequest) {
    const clean: Record<string, any> = {};
    const patch = data.patch ?? {};
    for (const key of EDITABLE_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(patch, key)) clean[key] = patch[key];
    }
    this.output_object = { resume_draft_id: data.resume_draft_id, patch: clean };
  }
  public getDtoObject(): IUpdateResumeDraftDto { return this.output_object; }
}
