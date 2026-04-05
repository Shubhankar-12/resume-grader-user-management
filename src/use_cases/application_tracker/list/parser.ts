/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from '../../../base_classes';
import { UserResumeValidator } from '../../user_resume/UserResumeValidator';

export class ListApplicationsParser extends BaseParser {
  private applicationValidator: UserResumeValidator;

  constructor(data: any, applicationValidator: UserResumeValidator) {
    super();
    this.applicationValidator = applicationValidator;
    this.parseUserId(data.user_id);
  }

  parseUserId(value: any): void {
    const result = this.applicationValidator.validateId('user_id', value);
    this.pushIfError(result);
  }
}
