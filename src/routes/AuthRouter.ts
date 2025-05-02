import express from "express";
import { baseRouterHandler } from "../base_classes";
import { POLICIES } from "../common_middleware/policies";
// For file uploads
import multer from "multer";
import {
  githubAuthController,
  githubAuthMiddleware,
} from "../use_cases/login/github_auth";
import {
  loginUserWithEmailController,
  loginUserWithEmailMiddleware,
} from "../use_cases/login/email";
import {
  registerUserWithEmailController,
  registerUserWithEmailMiddleware,
} from "../use_cases/login/register";
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
baseRouterHandler.handleWithHooks(
  authRouter,
  "post",
  "/login",
  // loginUserWithEmailMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY])
  // loginUserWithEmailMiddleware.ensureAuthorization(),
  loginUserWithEmailMiddleware.ensureValidation(),
  loginUserWithEmailController.execute()
);
baseRouterHandler.handleWithHooks(
  authRouter,
  "post",
  "/register",
  // registerUserWithEmailMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY])
  // registerUserWithEmailMiddleware.ensureAuthorization(),
  registerUserWithEmailMiddleware.ensureValidation(),
  registerUserWithEmailController.execute()
);
