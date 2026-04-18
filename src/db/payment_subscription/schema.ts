import {
  Schema, Types, model,
} from 'mongoose';

const ObjectId = Types.ObjectId;

const PaymentSubscriptionSchema = new Schema(
    {
      user_id: {
        type: ObjectId,
        required: true,
      },
      razorpay_subscription_id: { type: String },
      razorpay_customer_id: { type: String },
      plan: {
        type: String,
        required: true,
        enum: ['FREE', 'STARTER', 'BASIC', 'PRO', 'CAREER_PLUS'],
      },
      start_date: { type: Date },
      end_date: { type: Date },
      status: {
        type: String,
        enum: ['ACTIVE', 'PAST_DUE', 'CANCELLED', 'INACTIVE'],
        required: true,
      },
      provider: {
        type: String,
        enum: ['razorpay', 'stripe'],
        required: true,
        default: 'razorpay',
      },
      region: {
        type: String,
        enum: ['IN', 'GLOBAL'],
        required: true,
        default: 'IN',
      },
      currency: {
        type: String,
        enum: ['INR', 'USD'],
        required: true,
        default: 'INR',
      },
      provider_subscription_id: { type: String, default: null },
      stripe_customer_id: { type: String, default: null },
      last_renewed_on: { type: Date, default: null },
      cancelled_on: { type: Date, default: null },
    },
    {
      timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on',
      },
    }
);

export { PaymentSubscriptionSchema };
