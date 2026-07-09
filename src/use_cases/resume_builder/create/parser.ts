// src/use_cases/resume_builder/create/parser.ts
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseParser } from '../../../base_classes';
import { UserResumeValidator } from '../../user_resume/UserResumeValidator';

export class CreateResumeDraftParser extends BaseParser {
  private validator: UserResumeValidator;
  constructor(data: any, validator: UserResumeValidator) {
    super();
    this.validator = validator;
    this.parseUserId(data.user_id);
  }
  parseUserId(value: any): void {
    this.pushIfError(this.validator.validateId('user_id', value));
  }
}
