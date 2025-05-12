import { paymentSubscriptionQueries, userQueries } from "../../../db";
import { razorpay } from "../../../helpers/razorpayClient";

import crypto from "crypto";

import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
  ResponseLocalAuth,
} from "../../../interfaces";
import { logUnexpectedUsecaseError } from "../../../logger";
import { InternalServerError } from "./errors";
import { IWebhookPaymentSubscriptionDto } from "./dto";
import { InvalidWebhookSignatureError } from "./errors";

type Response = Either<UseCaseError, any>;
type PaymentSubscriptionRequest = {
  request: IWebhookPaymentSubscriptionDto;
  headers: any;
};

export class WebhookPaymentSubscriptionUseCase
  implements UseCase<PaymentSubscriptionRequest, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute({
    request,
    headers,
  }: PaymentSubscriptionRequest): Promise<Response> {
    try {
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
      const receivedSignature = headers["x-razorpay-signature"] as string;
      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(request))
        .digest("hex");
      if (generatedSignature !== receivedSignature) {
        return errClass(new InvalidWebhookSignatureError());
      }
      const { event, payload } = request;
      if (event === "subscription.activated") {
        const subscriptionId = payload.subscription.entity.id;
        await paymentSubscriptionQueries.updatePaymentSubscription({
          payment_subscription_id: subscriptionId,
          status: "ACTIVE",
        });
      }

      if (event === "subscription.cancelled") {
        const subscriptionId = payload.subscription.entity.id;
        await paymentSubscriptionQueries.updatePaymentSubscription({
          payment_subscription_id: subscriptionId,
          status: "CANCELLED",
        });
      }

      return successClass({
        status: "success",
        message: "Webhook processed successfully",
      });
    } catch (error) {
      console.error(
        "Unexpected error in WebhookPaymentSubscriptionUseCase:",
        error
      );
      return errClass(new InternalServerError());
    }
  }
}
