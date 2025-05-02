import { LoginUserWithEmailMiddleware } from './middleware';
import { LoginUserWithEmailUseCase } from './usecase';
import { LoginUserWithEmailController } from './controller';

const loginUserWithEmailUseCase = new LoginUserWithEmailUseCase();
export const loginUserWithEmailController = new LoginUserWithEmailController(
    loginUserWithEmailUseCase
);
export const loginUserWithEmailMiddleware = new LoginUserWithEmailMiddleware();
