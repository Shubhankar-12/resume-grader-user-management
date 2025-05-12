/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from "mongodb";
import {
  IPaymentSubscription,
  IPaymentSubscriptionDocument,
  IPaymentSubscriptionModel,
} from "../payment_subscription/types";

export class PaymentSubscriptionQueries {
  private paymentSubscriptionModel: IPaymentSubscriptionModel;

  constructor(paymentSubscriptionModel: IPaymentSubscriptionModel) {
    this.paymentSubscriptionModel = paymentSubscriptionModel;
  }

  async create(user: any): Promise<any> {
    return await this.paymentSubscriptionModel.create(user);
  }

  async getPaymentSubscriptionbyUserId(data: any): Promise<any[]> {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        user_id: new ObjectId(data.user_id),
      },
    });
    if (data.status) {
      aggregateQuery.push({
        $match: {
          status: data.status,
        },
      });
    }

    aggregateQuery.push({
      $sort: {
        created_on: -1,
      },
    });

    aggregateQuery.push({
      $project: {
        _id: 0,
        payment_subscription_id: "$_id",
        user_id: 1,
        razorpay_subscription_id: 1,
        razorpay_customer_id: 1,
        plan: 1,
        status: 1,
        created_on: 1,
        updated_on: 1,
      },
    });

    const result = await this.paymentSubscriptionModel.aggregate(
      aggregateQuery
    );

    return result;
  }
  async getPaymentSubscriptionbyId(data: any): Promise<any[]> {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        _id: new ObjectId(data.payment_subscription_id),
      },
    });

    aggregateQuery.push({
      $sort: {
        created_on: -1,
      },
    });

    aggregateQuery.push({
      $project: {
        _id: 0,
        payment_subscription_id: "$_id",
        user_id: 1,
        razorpay_subscription_id: 1,
        razorpay_customer_id: 1,
        plan: 1,
        status: 1,
        created_on: 1,
        updated_on: 1,
      },
    });

    const result = await this.paymentSubscriptionModel.aggregate(
      aggregateQuery
    );

    return result;
  }

  async updatePaymentSubscription(data: any): Promise<any> {
    const filter = { payment_subscription_id: data.payment_subscription_id };
    return await this.paymentSubscriptionModel.updateOne(filter, {
      $set: data,
    });
  }
}
