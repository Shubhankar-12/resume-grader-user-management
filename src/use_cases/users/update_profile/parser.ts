/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from '../../../base_classes';
import { UserValidator } from '../UserValidator';

export class UpdateProfileParser extends BaseParser {
  private userValidator: UserValidator;

  constructor(data: any, userValidator: UserValidator) {
    super();
    this.userValidator = userValidator;
    this.parseId(data.user_id, 'user_id');
  }

  parseId(value: any, fieldName: string): void {
    const result = this.userValidator.validateId(fieldName, value);
    this.pushIfError(result);
  }
}
