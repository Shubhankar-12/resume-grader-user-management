import express from "express";
import { baseRouterHandler } from "../base_classes";
import { POLICIES } from "../common_middleware/policies";
// For file uploads
import multer from "multer";
import {
  createTailoredResumeController,
  createTailoredResumeMiddleware,
} from "../use_cases/tailored_resume/create";
import {
  getTailoredResumeByIdController,
  getTailoredResumeByIdMiddleware,
} from "../use_cases/tailored_resume/get_by_id";
import {
  createMatchReportController,
  createMatchReportMiddleware,
} from "../use_cases/tailored_resume/create_match";
import {
  getAllTailoredResumesController,
  getAllTailoredResumesMiddleware,
} from "../use_cases/tailored_resume/get_all";
import { PlanLimitChecker } from "../common_middleware/planMiddleware";

export const tailoredResumeRouter = express.Router();
const tailoredResumeLimiter = new PlanLimitChecker("tailoredResumes").check();

baseRouterHandler.handleWithHooks(
  tailoredResumeRouter,
  "get",
  "/list",
  getAllTailoredResumesMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  getAllTailoredResumesMiddleware.ensureLoggedIn(),
  getAllTailoredResumesMiddleware.ensureValidation(),
  getAllTailoredResumesController.execute()
);

baseRouterHandler.handleWithHooks(
  tailoredResumeRouter,
  "post",
  "/create",
  createTailoredResumeMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  createTailoredResumeMiddleware.ensureLoggedIn(),
  createTailoredResumeMiddleware.ensureValidation(),
  tailoredResumeLimiter,
  createTailoredResumeController.execute()
);
baseRouterHandler.handleWithHooks(
  tailoredResumeRouter,
  "get",
  "/",
  getTailoredResumeByIdMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  getTailoredResumeByIdMiddleware.ensureLoggedIn(),
  getTailoredResumeByIdMiddleware.ensureValidation(),
  getTailoredResumeByIdController.execute()
);

baseRouterHandler.handleWithHooks(
  tailoredResumeRouter,
  "post",
  "/match",
  createMatchReportMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  createMatchReportMiddleware.ensureLoggedIn(),
  createMatchReportMiddleware.ensureValidation(),
  tailoredResumeLimiter,
  createMatchReportController.execute()
);
