import { Schema, Types, model } from "mongoose";

const ObjectId = Types.ObjectId;

const PaymentSubscriptionSchema = new Schema(
  {
    user_id: {
      type: ObjectId,
      required: true,
    },
    razorpay_subscription_id: {
      type: String,
    },
    razorpay_customer_id: {
      type: String,
    },
    plan: {
      type: String,
      required: true,
      enum: ["FREE", "BASIC", "PREMIUM"],
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED", "INACTIVE"],
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_on",
      updatedAt: "updated_on",
    },
  }
);

export { PaymentSubscriptionSchema };
