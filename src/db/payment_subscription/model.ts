import { model } from "mongoose";
import { PaymentSubscriptionSchema } from "./schema";
import { IPaymentSubscriptionDocument } from "./types";

const paymentSubscriptionModel = model<IPaymentSubscriptionDocument>(
  "payment_subscription",
  PaymentSubscriptionSchema,
  "payment_subscriptions"
);

export { paymentSubscriptionModel };
