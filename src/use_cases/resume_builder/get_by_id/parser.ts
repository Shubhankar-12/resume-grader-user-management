// src/use_cases/resume_builder/get_by_id/parser.ts
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseParser } from '../../../base_classes';
import { UserResumeValidator } from '../../user_resume/UserResumeValidator';
export class GetResumeDraftByIdParser extends BaseParser {
  private validator: UserResumeValidator;
  constructor(data: any, validator: UserResumeValidator) {
    super();
    this.validator = validator;
    this.pushIfError(this.validator.validateId('resume_draft_id', data.resume_draft_id));
  }
}
