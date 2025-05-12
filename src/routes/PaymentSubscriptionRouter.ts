import express from "express";
import { baseRouterHandler } from "../base_classes";
import { POLICIES } from "../common_middleware/policies";
// For file uploads
import multer from "multer";
import {
  createPaymentSubscriptionController,
  createPaymentSubscriptionMiddleware,
} from "../use_cases/payment_subscription/create";

export const paymentSubscriptionRouter = express.Router();

baseRouterHandler.handleWithHooks(
  paymentSubscriptionRouter,
  "post",
  "/create",
  // createPaymentSubscriptionMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY])
  // createPaymentSubscriptionMiddleware.ensureAuthorization(),
  createPaymentSubscriptionMiddleware.ensureValidation(),
  createPaymentSubscriptionController.execute()
);
