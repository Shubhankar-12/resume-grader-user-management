import express from "express";
import { baseRouterHandler } from "../base_classes";
import { POLICIES } from "../common_middleware/policies";
// For file uploads
import multer from "multer";
import {
  uploadDocController,
  uploadDocMiddleware,
} from "../use_cases/media/upload_doc";

export const mediaRouter = express.Router();

/**
 * Docs for image/upload route
 * Request to be send in the form data
 * the file key has to be image
 * It allows both policies for admin and owner
 */
const upload = multer({
  limits: { fileSize: 500 * 1024 * 1024 },
}).single("document");
baseRouterHandler.handleWithHooks(
  mediaRouter,
  "post",
  "/upload-doc",
  async (req, res, next) => {
    upload(req, res, next);
  },
  // uploadDocMiddleware.ensureAuthentication([
  //   POLICIES.ADMIN_POLICY,
  //   POLICIES.OWNER_POLICY,
  // ]),
  uploadDocMiddleware.ensureValidation(),
  // uploadDocMiddleware.ensureLoggedIn(),
  uploadDocController.execute()
);
