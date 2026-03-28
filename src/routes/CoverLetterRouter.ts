import express from "express";
import { baseRouterHandler } from "../base_classes";
import { POLICIES } from "../common_middleware/policies";

import {
  createCoverLetterController,
  createCoverLetterMiddleware,
} from "../use_cases/cover_letter/create_cover_letter";
import {
  getAllCoverLettersController,
  getAllCoverLettersMiddleware,
} from "../use_cases/cover_letter/get_all";
import {
  updateCoverLetterController,
  updateCoverLetterMiddleware,
} from "../use_cases/cover_letter/update";
import {
  getCoverLetterByIdController,
  getCoverLetterByIdMiddleware,
} from "../use_cases/cover_letter/get_by_id";
import { PlanLimitChecker } from "../common_middleware/planMiddleware";
import { createAIRateLimiter } from "../common_middleware/rateLimiter";
export const coverLetterRouter = express.Router();
const aiLimiter = createAIRateLimiter();
const coverLetterLimiter = new PlanLimitChecker("coverLetters").check();

baseRouterHandler.handleWithHooks(
  coverLetterRouter,
  "post",
  "/create",
  createCoverLetterMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  createCoverLetterMiddleware.ensureLoggedIn(),
  createCoverLetterMiddleware.ensureValidation(),
  aiLimiter,
  coverLetterLimiter,
  createCoverLetterController.execute()
);

baseRouterHandler.handleWithHooks(
  coverLetterRouter,
  "get",
  "/list",
  getAllCoverLettersMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  getAllCoverLettersMiddleware.ensureLoggedIn(),
  getAllCoverLettersMiddleware.ensureValidation(),
  getAllCoverLettersController.execute()
);
baseRouterHandler.handleWithHooks(
  coverLetterRouter,
  "get",
  "/",
  getCoverLetterByIdMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  getCoverLetterByIdMiddleware.ensureLoggedIn(),
  getCoverLetterByIdMiddleware.ensureValidation(),
  getCoverLetterByIdController.execute()
);
baseRouterHandler.handleWithHooks(
  coverLetterRouter,
  "patch",
  "/update",
  updateCoverLetterMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  updateCoverLetterMiddleware.ensureLoggedIn(),
  updateCoverLetterMiddleware.ensureValidation(),
  coverLetterLimiter,
  updateCoverLetterController.execute()
);
