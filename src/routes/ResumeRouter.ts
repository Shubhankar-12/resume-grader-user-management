import express from "express";
import { baseRouterHandler } from "../base_classes";
import { POLICIES } from "../common_middleware/policies";
// For file uploads
import multer from "multer";
import {
  createUserResumeController,
  createUserResumeMiddleware,
} from "../use_cases/user_resume/create";
export const resumeRouter = express.Router();

baseRouterHandler.handleWithHooks(
  resumeRouter,
  "post",
  "/create",
  // createUserResumeMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  // createUserResumeMiddleware.ensureLoggedIn(),
  // createUserResumeMiddleware.ensureValidation(),
  createUserResumeController.execute()
);
