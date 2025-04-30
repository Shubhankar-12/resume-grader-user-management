/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from "../../../base_classes";
import { UserResumeValidator } from "../UserResumeValidator";

export class CreateCoverLetterParser extends BaseParser {
  private coverLetterValidator: UserResumeValidator;

  constructor(data: any, coverLetterValidator: UserResumeValidator) {
    super();
    this.coverLetterValidator = coverLetterValidator;
    this.parseEmployeeId(data.resume_id);
  }

  // parseTitle(value: any): void {
  //   const result = this.coverLetterValidator.validateTitle(value);
  //   this.pushIfError(result);
  // }

  // parseMessage(value: any): void {
  //   const result = this.coverLetterValidator.validateMessage(value);
  //   this.pushIfError(result);
  // }

  parseEmployeeId(value: any): void {
    const result = this.coverLetterValidator.validateId("resume_id", value);
    this.pushIfError(result);
  }

  parseForeignId(value: any): void {
    const result = this.coverLetterValidator.validateId("foreign_id", value);
    this.pushIfError(result);
  }
}
