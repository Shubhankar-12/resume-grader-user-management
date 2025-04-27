/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from "../../../base_classes";
import { UserResumeValidator } from "../UserResumeValidator";

export class DisableUserResumeParser extends BaseParser {
  private userResumeValidator: UserResumeValidator;

  constructor(data: any, userResumeValidator: UserResumeValidator) {
    super();
    this.userResumeValidator = userResumeValidator;
    this.parseEmployeeId(data.user_id);
  }

  // parseTitle(value: any): void {
  //   const result = this.userResumeValidator.validateTitle(value);
  //   this.pushIfError(result);
  // }

  // parseMessage(value: any): void {
  //   const result = this.userResumeValidator.validateMessage(value);
  //   this.pushIfError(result);
  // }

  parseEmployeeId(value: any): void {
    const result = this.userResumeValidator.validateId("user_id", value);
    this.pushIfError(result);
  }

  parseForeignId(value: any): void {
    const result = this.userResumeValidator.validateId("foreign_id", value);
    this.pushIfError(result);
  }
}
