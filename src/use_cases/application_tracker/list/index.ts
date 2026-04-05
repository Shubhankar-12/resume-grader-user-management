import { ListApplicationsMiddleware } from './middleware';
import { ListApplicationsUseCase } from './usecase';
import { ListApplicationsController } from './controller';

const listApplicationsUseCase = new ListApplicationsUseCase();
export const listApplicationsController = new ListApplicationsController(
    listApplicationsUseCase
);
export const listApplicationsMiddleware = new ListApplicationsMiddleware();
