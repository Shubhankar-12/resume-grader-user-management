import express from "express";
import { baseRouterHandler } from "../base_classes";
import { POLICIES } from "../common_middleware/policies";
// For file uploads
import multer from "multer";
import {
  githubAuthController,
  githubAuthMiddleware,
} from "../use_cases/login/github_auth";
export const authRouter = express.Router();

baseRouterHandler.handleWithHooks(
  authRouter,
  "post",
  "/github",
  // githubAuthMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY])
  // githubAuthMiddleware.ensureAuthorization(),
  githubAuthMiddleware.ensureValidation(),
  githubAuthController.execute()
);
