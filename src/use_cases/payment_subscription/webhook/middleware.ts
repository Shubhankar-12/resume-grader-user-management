import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { webhookPaymentSubscriptionValidator } from "./validator";

export class WebhookPaymentSubscriptionMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return webhookPaymentSubscriptionValidator.validate();
  }
}
