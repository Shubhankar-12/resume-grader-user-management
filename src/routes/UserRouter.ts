import express from "express";
import { baseRouterHandler } from "../base_classes";
import { POLICIES } from "../common_middleware/policies";
// For file uploads
import multer from "multer";
import {
  getUserByIdController,
  getUserByIdMiddleware,
} from "../use_cases/users/get_by_id";
export const userRouter = express.Router();

baseRouterHandler.handleWithHooks(
  userRouter,
  "get",
  "/",
  getUserByIdMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  getUserByIdMiddleware.ensureLoggedIn(),
  getUserByIdMiddleware.ensureValidation(),
  getUserByIdController.execute()
);
