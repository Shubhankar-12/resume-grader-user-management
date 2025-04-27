/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { BaseParser } from "../../../base_classes";
import { UserResumeValidator } from "../UserResumeValidator";

export class GetAllUserResumesParser extends BaseParser {
  private userResumeValidator: UserResumeValidator;

  constructor(data: any, userResumeValidator: UserResumeValidator) {
    super();
    this.userResumeValidator = userResumeValidator;
    // this.parseSkip(data.skip);
    // this.parseLimit(data.limit);
    data.skip != undefined && this.parseSkip(data.skip);
    data.limit != undefined && this.parseLimit(data.limit);

    // for optional parameters
    data.search && this.parseSearch(data.search);
    data.user_id && this.parseEmployeeId(data.user_id);
  }

  parseSkip(value: any): void {
    const result = this.userResumeValidator.validateSkip(value);
    this.pushIfError(result);
  }

  parseLimit(value: any): void {
    const result = this.userResumeValidator.validateLimit(value);
    this.pushIfError(result);
  }

  parseEmployeeId(value: any): void {
    const result = this.userResumeValidator.validateId("user_id", value);
    this.pushIfError(result);
  }
  parseSearch(value: any): void {
    const result = this.userResumeValidator.validateSearch(value);
    this.pushIfError(result);
  }
}
