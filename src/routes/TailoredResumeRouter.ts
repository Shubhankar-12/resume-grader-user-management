import express from "express";
import { baseRouterHandler } from "../base_classes";
import { POLICIES } from "../common_middleware/policies";
// For file uploads
import multer from "multer";
import {
  createTailoredResumeController,
  createTailoredResumeMiddleware,
} from "../use_cases/tailored_resume/create";

export const tailoredResumeRouter = express.Router();

baseRouterHandler.handleWithHooks(
  tailoredResumeRouter,
  "post",
  "/create",
  // createTailoredResumeMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  // createTailoredResumeMiddleware.ensureLoggedIn(),
  // createTailoredResumeMiddleware.ensureValidation(),
  createTailoredResumeController.execute()
);
