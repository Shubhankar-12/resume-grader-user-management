import express from 'express';
import { baseRouterHandler } from '../base_classes';
import { POLICIES } from '../common_middleware/policies';
import { createResumeDraftController, createResumeDraftMiddleware } from '../use_cases/resume_builder/create';
import { getAllResumeDraftsController, getAllResumeDraftsMiddleware } from '../use_cases/resume_builder/get_all';
import { getResumeDraftByIdController, getResumeDraftByIdMiddleware } from '../use_cases/resume_builder/get_by_id';
import { updateResumeDraftController, updateResumeDraftMiddleware } from '../use_cases/resume_builder/update';
import { disableResumeDraftController, disableResumeDraftMiddleware } from '../use_cases/resume_builder/disable';
import { createAIRateLimiter } from '../common_middleware/rateLimiter';
import { requireCredits } from '../common_middleware/creditMiddleware';
import {
  improveBulletController,
  summaryController,
  skillsController,
  ghostwriteController,
  ghostwriteAcceptController,
} from '../use_cases/resume_builder/ai/controllers';

export const resumeBuilderRouter = express.Router();
const aiLimiter = createAIRateLimiter();

baseRouterHandler.handleWithHooks(
    resumeBuilderRouter, 'post', '/create',
    createResumeDraftMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    createResumeDraftMiddleware.ensureLoggedIn(),
    createResumeDraftMiddleware.ensureValidation(),
    createResumeDraftController.execute()
);

baseRouterHandler.handleWithHooks(
    resumeBuilderRouter, 'get', '/list',
    getAllResumeDraftsMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    getAllResumeDraftsMiddleware.ensureLoggedIn(),
    getAllResumeDraftsMiddleware.ensureValidation(),
    getAllResumeDraftsController.execute()
);

baseRouterHandler.handleWithHooks(
    resumeBuilderRouter, 'get', '/',
    getResumeDraftByIdMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    getResumeDraftByIdMiddleware.ensureLoggedIn(),
    getResumeDraftByIdMiddleware.ensureValidation(),
    getResumeDraftByIdController.execute()
);

baseRouterHandler.handleWithHooks(
    resumeBuilderRouter, 'patch', '/',
    updateResumeDraftMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    updateResumeDraftMiddleware.ensureLoggedIn(),
    updateResumeDraftMiddleware.ensureValidation(),
    updateResumeDraftController.execute()
);

baseRouterHandler.handleWithHooks(
    resumeBuilderRouter, 'post', '/disable',
    disableResumeDraftMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    disableResumeDraftMiddleware.ensureLoggedIn(),
    disableResumeDraftMiddleware.ensureValidation(),
    disableResumeDraftController.execute()
);

// --- AI assist (synchronous) ---

baseRouterHandler.handleWithHooks(
    resumeBuilderRouter, 'post', '/ai/improve-bullet',
    createResumeDraftMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    createResumeDraftMiddleware.ensureLoggedIn(),
    aiLimiter,
    requireCredits('resume_ai_assist'),
    improveBulletController.execute()
);

baseRouterHandler.handleWithHooks(
    resumeBuilderRouter, 'post', '/ai/summary',
    createResumeDraftMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    createResumeDraftMiddleware.ensureLoggedIn(),
    aiLimiter,
    requireCredits('resume_ai_assist'),
    summaryController.execute()
);

baseRouterHandler.handleWithHooks(
    resumeBuilderRouter, 'post', '/ai/skills',
    createResumeDraftMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    createResumeDraftMiddleware.ensureLoggedIn(),
    aiLimiter,
    requireCredits('resume_ai_assist'),
    skillsController.execute()
);

// Ghostwriter: generation is free (rate-limited); a credit is charged on accept.
baseRouterHandler.handleWithHooks(
    resumeBuilderRouter, 'post', '/ai/ghostwrite',
    createResumeDraftMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    createResumeDraftMiddleware.ensureLoggedIn(),
    aiLimiter,
    ghostwriteController.execute()
);

baseRouterHandler.handleWithHooks(
    resumeBuilderRouter, 'post', '/ai/ghostwrite/accept',
    createResumeDraftMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    createResumeDraftMiddleware.ensureLoggedIn(),
    ghostwriteAcceptController.execute()
);
