/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from "../../../base_classes";
import { UserResumeValidator } from "../UserResumeValidator";

export class CreateReportParser extends BaseParser {
  private reportValidator: UserResumeValidator;

  constructor(data: any, reportValidator: UserResumeValidator) {
    super();
    this.reportValidator = reportValidator;
    this.parseEmployeeId(data.resume_id);
  }

  // parseTitle(value: any): void {
  //   const result = this.reportValidator.validateTitle(value);
  //   this.pushIfError(result);
  // }

  // parseMessage(value: any): void {
  //   const result = this.reportValidator.validateMessage(value);
  //   this.pushIfError(result);
  // }

  parseEmployeeId(value: any): void {
    const result = this.reportValidator.validateId("resume_id", value);
    this.pushIfError(result);
  }

  parseForeignId(value: any): void {
    const result = this.reportValidator.validateId("foreign_id", value);
    this.pushIfError(result);
  }
}
