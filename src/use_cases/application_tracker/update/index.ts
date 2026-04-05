import { UpdateApplicationMiddleware } from './middleware';
import { UpdateApplicationUseCase } from './usecase';
import { UpdateApplicationController } from './controller';

const updateApplicationUseCase = new UpdateApplicationUseCase();
export const updateApplicationController = new UpdateApplicationController(
    updateApplicationUseCase
);
export const updateApplicationMiddleware = new UpdateApplicationMiddleware();
