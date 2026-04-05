import { ReorderApplicationMiddleware } from './middleware';
import { ReorderApplicationUseCase } from './usecase';
import { ReorderApplicationController } from './controller';

const reorderApplicationUseCase = new ReorderApplicationUseCase();
export const reorderApplicationController = new ReorderApplicationController(
    reorderApplicationUseCase
);
export const reorderApplicationMiddleware = new ReorderApplicationMiddleware();
