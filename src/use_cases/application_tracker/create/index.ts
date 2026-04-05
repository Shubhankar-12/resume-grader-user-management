import { CreateApplicationMiddleware } from './middleware';
import { CreateApplicationUseCase } from './usecase';
import { CreateApplicationController } from './controller';

const createApplicationUseCase = new CreateApplicationUseCase();
export const createApplicationController = new CreateApplicationController(
    createApplicationUseCase
);
export const createApplicationMiddleware = new CreateApplicationMiddleware();
