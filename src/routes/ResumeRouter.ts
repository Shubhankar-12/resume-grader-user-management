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
  // getAllUserResumesMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  // getAllUserResumesMiddleware.ensureLoggedIn(),
  // getAllUserResumesMiddleware.ensureValidation(),
  getAllUserResumesController.execute()
);
