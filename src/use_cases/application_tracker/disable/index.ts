import { DisableApplicationMiddleware } from './middleware';
import { DisableApplicationUseCase } from './usecase';
import { DisableApplicationController } from './controller';

const disableApplicationUseCase = new DisableApplicationUseCase();
export const disableApplicationController = new DisableApplicationController(
    disableApplicationUseCase
);
export const disableApplicationMiddleware = new DisableApplicationMiddleware();
