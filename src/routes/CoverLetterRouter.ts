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
export const coverLetterRouter = express.Router();
baseRouterHandler.handleWithHooks(
  coverLetterRouter,
  "post",
  "/create",
  createCoverLetterMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  createCoverLetterMiddleware.ensureLoggedIn(),
  createCoverLetterMiddleware.ensureValidation(),
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
  "patch",
  "/update",
  updateCoverLetterMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
  updateCoverLetterMiddleware.ensureLoggedIn(),
  updateCoverLetterMiddleware.ensureValidation(),
  updateCoverLetterController.execute()
);
