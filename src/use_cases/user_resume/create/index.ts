import { CreateUserResumeMiddleware } from "./middleware";
import { CreateUserResumeUseCase } from "./usecase";
import { CreateUserResumeController } from "./controller";

const createUserResumeUseCase = new CreateUserResumeUseCase();
export const createUserResumeController = new CreateUserResumeController(
  createUserResumeUseCase
);
export const createUserResumeMiddleware = new CreateUserResumeMiddleware();
