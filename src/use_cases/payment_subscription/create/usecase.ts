import { paymentSubscriptionQueries, userQueries } from "../../../db";
import { razorpay } from "../../../helpers/razorpayClient";

import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
  ResponseLocalAuth,
} from "../../../interfaces";
import { logUnexpectedUsecaseError } from "../../../logger";
import { InternalServerError } from "../../user_resume/create/errors";
import { ICreatePaymentSubscriptionDto } from "./dto";
import {
  ExtractedResumeNotFoundError,
  ResumeExtractionFailedError,
  UserNotFoundError,
} from "./errors";

type Response = Either<UseCaseError, any>;
type PaymentSubscriptionRequest = {
  request: ICreatePaymentSubscriptionDto;
  auth: ResponseLocalAuth;
};

export class CreatePaymentSubscriptionUseCase
  implements UseCase<PaymentSubscriptionRequest, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute({
    request,
    auth,
  }: PaymentSubscriptionRequest): Promise<Response> {
    try {
      const userId = auth?.decoded_token?.user?.id;

      if (!userId) {
        return errClass(new UserNotFoundError("userId", "user_id"));
      }

      const existingUser = await userQueries.getUserById(userId);
      if (existingUser.length == 0) {
        return errClass(new UserNotFoundError(userId, "user_id"));
      }
      let customerId = existingUser[0].razorpay_customer_id;

      if (!customerId) {
        const customer = await razorpay.customers.create({
          name: existingUser[0].name,
          email: existingUser[0].email,
        });
        customerId = customer.id;
        await userQueries.updateUser({
          user_id: userId,
          razorpay_customer_id: customerId,
        });
      }
      const plans = {
        FREE: { price: 0 },
        BASIC: { plan_id: "plan_QWRQdP8yGRIAek" },
        PRO: { plan_id: "plan_QWRQ7ZlOgwdNgS" },
      };

      if (request.plan === "FREE") {
        await paymentSubscriptionQueries.create({
          user_id: existingUser[0]._id,
          razorpayCustomerId: customerId,
          plan: "FREE",
          status: "ACTIVE",
        });

        return successClass({
          user_id: existingUser[0]._id,
          payment_subscription_id: undefined,
          razorpay_customer_id: customerId,
          plan: "FREE",
          status: "ACTIVE",
        });
      }

      const subscription = await razorpay.subscriptions.create({
        plan_id: plans[request.plan].plan_id,
        customer_notify: 1,
        total_count: 12,
        start_at: Math.floor(new Date().getTime() / 1000),
      });
      console.log("subscription", subscription);

      await paymentSubscriptionQueries.create({
        user_id: existingUser[0]._id,
        razorpayCustomerId: customerId,
        razorpaySubscriptionId: subscription.id,
        start_date: subscription.created_at,
        end_date: subscription.created_at + 12 * 30 * 24 * 60 * 60 * 1000,
        plan: request.plan,
        status: "ACTIVE",
      });

      return successClass({
        user_id: existingUser[0]._id,
        payment_subscription_id: subscription.id,
        razorpay_customer_id: customerId,
        plan: request.plan,
        start_date: subscription.created_at,
        end_date: subscription.ended_at,
        status: "ACTIVE",
      });
    } catch (error) {
      console.error(
        "Unexpected error in CreatePaymentSubscriptionUseCase:",
        error
      );
      return errClass(new InternalServerError());
    }
  }
}
