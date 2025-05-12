import { CreatePaymentSubscriptionMiddleware } from "./middleware";
import { CreatePaymentSubscriptionUseCase } from "./usecase";
import { CreatePaymentSubscriptionController } from "./controller";

const createPaymentSubscriptionUseCase = new CreatePaymentSubscriptionUseCase();
export const createPaymentSubscriptionController =
  new CreatePaymentSubscriptionController(createPaymentSubscriptionUseCase);
export const createPaymentSubscriptionMiddleware =
  new CreatePaymentSubscriptionMiddleware();
