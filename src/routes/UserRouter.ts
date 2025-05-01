import express from "express";
import { baseRouterHandler } from "../base_classes";
import { POLICIES } from "../common_middleware/policies";
// For file uploads
import multer from "multer";
import {
  getUserByIdController,
  getUserByIdMiddleware,
} from "../use_cases/users/get_by_id";
import {
  createProjectAnalysisController,
  createProjectAnalysisMiddleware,
} from "../use_cases/project_analysis/create";
export const userRouter = express.Router();

baseRouterHandler.handleWithHooks(
  userRouter,
  "post",
  "/project-analysis/create",
  createProjectAnalysisMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  createProjectAnalysisMiddleware.ensureLoggedIn(),
  createProjectAnalysisMiddleware.ensureValidation(),
  createProjectAnalysisController.execute()
);
baseRouterHandler.handleWithHooks(
  userRouter,
  "get",
  "/",
  getUserByIdMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  getUserByIdMiddleware.ensureLoggedIn(),
  getUserByIdMiddleware.ensureValidation(),
  getUserByIdController.execute()
);
