import { Document, Model } from "mongoose";

interface IPaymentSubscription {
  user_id: string;
  razorpay_subscription_id: string;
  razorpay_customer_id: string;
  plan: string;
  start_date: Date;
  end_date: Date;
  status: string;
}

interface IPaymentSubscriptionDocument extends IPaymentSubscription, Document {}

type IPaymentSubscriptionModel = Model<IPaymentSubscriptionDocument>;

export {
  IPaymentSubscription,
  IPaymentSubscriptionDocument,
  IPaymentSubscriptionModel,
};
