import { UpdateProfileMiddleware } from './middleware';
import { UpdateProfileUseCase } from './usecase';
import { UpdateProfileController } from './controller';

const updateProfileUseCase = new UpdateProfileUseCase();
export const updateProfileController = new UpdateProfileController(
  updateProfileUseCase
);
export const updateProfileMiddleware = new UpdateProfileMiddleware();
