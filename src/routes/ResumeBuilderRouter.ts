import express from 'express';
import { baseRouterHandler } from '../base_classes';
import { POLICIES } from '../common_middleware/policies';
import { createResumeDraftController, createResumeDraftMiddleware } from '../use_cases/resume_builder/create';
import { getAllResumeDraftsController, getAllResumeDraftsMiddleware } from '../use_cases/resume_builder/get_all';
import { getResumeDraftByIdController, getResumeDraftByIdMiddleware } from '../use_cases/resume_builder/get_by_id';
import { updateResumeDraftController, updateResumeDraftMiddleware } from '../use_cases/resume_builder/update';
import { disableResumeDraftController, disableResumeDraftMiddleware } from '../use_cases/resume_builder/disable';

export const resumeBuilderRouter = express.Router();

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
