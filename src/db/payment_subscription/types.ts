import {
  Document, Model,
} from 'mongoose';

interface IPaymentSubscription {
  user_id: string;
  razorpay_subscription_id: string;
  razorpay_customer_id: string;
  plan: string;
  start_date: Date;
  end_date: Date;
  status: string;
  provider?: 'razorpay' | 'stripe';
  region?: 'IN' | 'GLOBAL';
  currency?: 'INR' | 'USD';
  provider_subscription_id?: string | null;
  stripe_customer_id?: string | null;
  last_renewed_on?: Date | null;
  cancelled_on?: Date | null;
}

interface IPaymentSubscriptionDocument extends IPaymentSubscription, Document {}

type IPaymentSubscriptionModel = Model<IPaymentSubscriptionDocument>;

export {
  IPaymentSubscription,
  IPaymentSubscriptionDocument,
  IPaymentSubscriptionModel,
};
