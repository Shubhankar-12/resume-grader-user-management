import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { createPaymentSubscriptionValidator } from "./validator";

export class CreatePaymentSubscriptionMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return createPaymentSubscriptionValidator.validate();
  }
}
