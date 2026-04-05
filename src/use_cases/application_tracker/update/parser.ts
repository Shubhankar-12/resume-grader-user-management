/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from '../../../base_classes';
import { UserResumeValidator } from '../../user_resume/UserResumeValidator';

export class UpdateApplicationParser extends BaseParser {
  private applicationValidator: UserResumeValidator;

  constructor(data: any, applicationValidator: UserResumeValidator) {
    super();
    this.applicationValidator = applicationValidator;
    this.parseId(data.application_id, 'application_id');
  }

  parseId(value: any, fieldName: string): void {
    const result = this.applicationValidator.validateId(fieldName, value);
    this.pushIfError(result);
  }
}
