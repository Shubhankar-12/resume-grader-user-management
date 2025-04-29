import express from "express";
import { baseRouterHandler } from "../base_classes";
import { POLICIES } from "../common_middleware/policies";
// For file uploads
import multer from "multer";
import {
  createUserResumeController,
  createUserResumeMiddleware,
} from "../use_cases/user_resume/create";
import {
  getAllUserResumesController,
  getAllUserResumesMiddleware,
} from "../use_cases/user_resume/get_all";
import { disableUserResumeController } from "../use_cases/user_resume/disable";
import {
  createReportController,
  createReportMiddleware,
} from "../use_cases/user_resume/create_report";
import {
  getReportByResumeIdController,
  getReportByResumeIdMiddleware,
} from "../use_cases/user_resume/get_by_id";
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

baseRouterHandler.handleWithHooks(
  resumeRouter,
  "get",
  "/list",
  getAllUserResumesMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  getAllUserResumesMiddleware.ensureLoggedIn(),
  getAllUserResumesMiddleware.ensureValidation(),
  getAllUserResumesController.execute()
);
baseRouterHandler.handleWithHooks(
  resumeRouter,
  "patch",
  "/disable",
  // disableUserResumeMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  // disableUserResumeMiddleware.ensureLoggedIn(),
  // disableUserResumeMiddleware.ensureValidation(),
  disableUserResumeController.execute()
);

baseRouterHandler.handleWithHooks(
  resumeRouter,
  "post",
  "/report/create",
  // createReportMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  // createReportMiddleware.ensureLoggedIn(),
  // createReportMiddleware.ensureValidation(),
  createReportController.execute()
);
baseRouterHandler.handleWithHooks(
  resumeRouter,
  "get",
  "/report",
  // getReportByResumeIdMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  // getReportByResumeIdMiddleware.ensureLoggedIn(),
  // getReportByResumeIdMiddleware.ensureValidation(),
  getReportByResumeIdController.execute()
);
