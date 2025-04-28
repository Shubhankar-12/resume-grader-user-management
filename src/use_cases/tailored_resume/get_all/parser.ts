/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { BaseParser } from "../../../base_classes";
import { TailoredResumeValidator } from "../TailoredResumeValidator";

export class GetAllTailoredResumesParser extends BaseParser {
  private tailoredResumeValidator: TailoredResumeValidator;

  constructor(data: any, tailoredResumeValidator: TailoredResumeValidator) {
    super();
    this.tailoredResumeValidator = tailoredResumeValidator;
    // this.parseSkip(data.skip);
    // this.parseLimit(data.limit);
    data.skip != undefined && this.parseSkip(data.skip);
    data.limit != undefined && this.parseLimit(data.limit);

    // for optional parameters
    data.search && this.parseSearch(data.search);
    data.user_id && this.parseEmployeeId(data.user_id);
  }

  parseSkip(value: any): void {
    const result = this.tailoredResumeValidator.validateSkip(value);
    this.pushIfError(result);
  }

  parseLimit(value: any): void {
    const result = this.tailoredResumeValidator.validateLimit(value);
    this.pushIfError(result);
  }

  parseEmployeeId(value: any): void {
    const result = this.tailoredResumeValidator.validateId("user_id", value);
    this.pushIfError(result);
  }
  parseSearch(value: any): void {
    const result = this.tailoredResumeValidator.validateSearch(value);
    this.pushIfError(result);
  }
}
