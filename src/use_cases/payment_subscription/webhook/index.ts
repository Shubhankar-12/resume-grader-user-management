import { WebhookPaymentSubscriptionMiddleware } from "./middleware";
import { WebhookPaymentSubscriptionUseCase } from "./usecase";
import { WebhookPaymentSubscriptionController } from "./controller";

const webhookPaymentSubscriptionUseCase =
  new WebhookPaymentSubscriptionUseCase();
export const webhookPaymentSubscriptionController =
  new WebhookPaymentSubscriptionController(webhookPaymentSubscriptionUseCase);
export const webhookPaymentSubscriptionMiddleware =
  new WebhookPaymentSubscriptionMiddleware();
