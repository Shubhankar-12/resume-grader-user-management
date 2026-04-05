import express from 'express';
import { baseRouterHandler } from '../base_classes';
import { POLICIES } from '../common_middleware/policies';

import {
    createApplicationController,
    createApplicationMiddleware,
} from '../use_cases/application_tracker/create';
import {
    listApplicationsController,
    listApplicationsMiddleware,
} from '../use_cases/application_tracker/list';
import {
    updateApplicationController,
    updateApplicationMiddleware,
} from '../use_cases/application_tracker/update';
import {
    reorderApplicationController,
    reorderApplicationMiddleware,
} from '../use_cases/application_tracker/reorder';
import {
    disableApplicationController,
    disableApplicationMiddleware,
} from '../use_cases/application_tracker/disable';

export const applicationTrackerRouter = express.Router();

// POST /create
baseRouterHandler.handleWithHooks(
    applicationTrackerRouter,
    'post',
    '/create',
    createApplicationMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    createApplicationMiddleware.ensureLoggedIn(),
    createApplicationMiddleware.ensureValidation(),
    createApplicationController.execute()
);

// GET /list
baseRouterHandler.handleWithHooks(
    applicationTrackerRouter,
    'get',
    '/list',
    listApplicationsMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    listApplicationsMiddleware.ensureLoggedIn(),
    listApplicationsMiddleware.ensureValidation(),
    listApplicationsController.execute()
);

// PATCH /update
baseRouterHandler.handleWithHooks(
    applicationTrackerRouter,
    'patch',
    '/update',
    updateApplicationMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    updateApplicationMiddleware.ensureLoggedIn(),
    updateApplicationMiddleware.ensureValidation(),
    updateApplicationController.execute()
);

// PATCH /reorder
baseRouterHandler.handleWithHooks(
    applicationTrackerRouter,
    'patch',
    '/reorder',
    reorderApplicationMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    reorderApplicationMiddleware.ensureLoggedIn(),
    reorderApplicationMiddleware.ensureValidation(),
    reorderApplicationController.execute()
);

// PATCH /disable
baseRouterHandler.handleWithHooks(
    applicationTrackerRouter,
    'patch',
    '/disable',
    disableApplicationMiddleware.ensureAuthentication([POLICIES.ADMIN_POLICY]),
    disableApplicationMiddleware.ensureLoggedIn(),
    disableApplicationMiddleware.ensureValidation(),
    disableApplicationController.execute()
);
