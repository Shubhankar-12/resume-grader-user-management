import { LogoutUserMiddleware } from './middleware';
import { LogoutUserUseCase } from './usecase';
import { LogoutUserController } from './controller';

const logoutUserUseCase = new LogoutUserUseCase();
export const logoutUserController = new LogoutUserController(
    logoutUserUseCase
);
export const logoutUserMiddleware = new LogoutUserMiddleware();
