/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from "../../../base_classes";
import { UserResumeValidator } from "../../user_resume/UserResumeValidator";

export class WebhookPaymentSubscriptionParser extends BaseParser {
  private paymentSubscriptionValidator: UserResumeValidator;

  constructor(data: any, paymentSubscriptionValidator: UserResumeValidator) {
    super();
    this.paymentSubscriptionValidator = paymentSubscriptionValidator;
    this.parseEmployeeId(data.resume_id);
    this.parseForeignId(data.user_id);
  }

  // parseTitle(value: any): void {
  //   const result = this.paymentSubscriptionValidator.validateTitle(value);
  //   this.pushIfError(result);
  // }

  // parseMessage(value: any): void {
  //   const result = this.paymentSubscriptionValidator.validateMessage(value);
  //   this.pushIfError(result);
  // }

  parseEmployeeId(value: any): void {
    const result = this.paymentSubscriptionValidator.validateId(
      "resume_id",
      value
    );
    this.pushIfError(result);
  }

  parseForeignId(value: any): void {
    const result = this.paymentSubscriptionValidator.validateId(
      "user_id",
      value
    );
    this.pushIfError(result);
  }
}
