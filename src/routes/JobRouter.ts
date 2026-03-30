import express from 'express';
import { baseRouterHandler } from '../base_classes';
import { POLICIES } from '../common_middleware/policies';
import {
  getJobStatusController,
  getJobStatusMiddleware,
} from '../use_cases/job/get_status';

export const jobRouter = express.Router();

baseRouterHandler.handleWithHooks(
    jobRouter,
    'get',
    '/status',
    getJobStatusMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    getJobStatusMiddleware.ensureLoggedIn(),
    getJobStatusMiddleware.ensureValidation(),
    getJobStatusController.execute()
);
