/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from "../../../base_classes";
import { UserResumeValidator } from "../../user_resume/UserResumeValidator";

export class UpdateCoverLetterParser extends BaseParser {
  private coverLetterValidator: UserResumeValidator;

  constructor(data: any, coverLetterValidator: UserResumeValidator) {
    super();
    this.coverLetterValidator = coverLetterValidator;
    this.parseId(data.cover_letter_id, "cover_letter_id");
    data.resume_id && this.parseId(data.resume_id, "resume_id");
    data.user_id && this.parseId(data.user_id, "user_id");
  }

  // parseTitle(value: any): void {
  //   const result = this.coverLetterValidator.validateTitle(value);
  //   this.pushIfError(result);
  // }

  // parseMessage(value: any): void {
  //   const result = this.coverLetterValidator.validateMessage(value);
  //   this.pushIfError(result);
  // }

  parseId(value: any, fieldName: string): void {
    const result = this.coverLetterValidator.validateId(fieldName, value);
    this.pushIfError(result);
  }
}
