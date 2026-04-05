import express from 'express';
import { baseRouterHandler } from '../base_classes';
import { POLICIES } from '../common_middleware/policies';
// For file uploads
import multer from 'multer';
import {
  getUserByIdController,
  getUserByIdMiddleware,
} from '../use_cases/users/get_by_id';
import {
  createProjectAnalysisController,
  createProjectAnalysisMiddleware,
} from '../use_cases/project_analysis/create';
import {
  githubUpdateController,
  githubUpdateMiddleware,
} from '../use_cases/users/github_auth';
import {
  getDashboardStatsByIdController,
  getDashboardStatsByIdMiddleware,
} from '../use_cases/users/get-stats';
import {
  updateProfileController,
  updateProfileMiddleware,
} from '../use_cases/users/update_profile';
import { getRolesController } from '../use_cases/users/get_roles';
import { createAIRateLimiter } from '../common_middleware/rateLimiter';
export const userRouter = express.Router();
const aiLimiter = createAIRateLimiter();

baseRouterHandler.handleWithHooks(
    userRouter,
    'post',
    '/project-analysis/create',
    createProjectAnalysisMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    createProjectAnalysisMiddleware.ensureLoggedIn(),
    createProjectAnalysisMiddleware.ensureValidation(),
    aiLimiter,
    createProjectAnalysisController.execute()
);
baseRouterHandler.handleWithHooks(
    userRouter,
    'get',
    '/',
    getUserByIdMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    getUserByIdMiddleware.ensureLoggedIn(),
    getUserByIdMiddleware.ensureValidation(),
    getUserByIdController.execute()
);
baseRouterHandler.handleWithHooks(
    userRouter,
    'get',
    '/stats',
    getDashboardStatsByIdMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    getDashboardStatsByIdMiddleware.ensureLoggedIn(),
    getDashboardStatsByIdMiddleware.ensureValidation(),
    getDashboardStatsByIdController.execute()
);
baseRouterHandler.handleWithHooks(
    userRouter,
    'patch',
    '/connect-github',
    githubUpdateMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    githubUpdateMiddleware.ensureLoggedIn(),
    githubUpdateMiddleware.ensureValidation(),
    githubUpdateController.execute()
);
baseRouterHandler.handleWithHooks(
    userRouter,
    'patch',
    '/profile',
    updateProfileMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    updateProfileMiddleware.ensureLoggedIn(),
    updateProfileMiddleware.ensureValidation(),
    updateProfileController.execute()
);

// Roles list (public — no auth needed)
userRouter.get('/roles', (req, res) => getRolesController.execute(req, res));
