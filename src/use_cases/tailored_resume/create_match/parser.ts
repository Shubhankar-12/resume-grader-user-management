/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from "../../../base_classes";
import { TailoredResumeValidator } from "../TailoredResumeValidator";

export class CreateMatchReportParser extends BaseParser {
  private tailoredResumeValidator: TailoredResumeValidator;

  constructor(data: any, tailoredResumeValidator: TailoredResumeValidator) {
    super();
    this.tailoredResumeValidator = tailoredResumeValidator;
    this.parseEmployeeId(data.resume_id);
  }

  // parseTitle(value: any): void {
  //   const result = this.tailoredResumeValidator.validateTitle(value);
  //   this.pushIfError(result);
  // }

  // parseMessage(value: any): void {
  //   const result = this.tailoredResumeValidator.validateMessage(value);
  //   this.pushIfError(result);
  // }

  parseEmployeeId(value: any): void {
    const result = this.tailoredResumeValidator.validateId("resume_id", value);
    this.pushIfError(result);
  }

  parseForeignId(value: any): void {
    const result = this.tailoredResumeValidator.validateId("foreign_id", value);
    this.pushIfError(result);
  }
}
