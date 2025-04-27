import { DisableUserResumeMiddleware } from "./middleware";
import { DisableUserResumeUseCase } from "./usecase";
import { DisableUserResumeController } from "./controller";

const disableUserResumeUseCase = new DisableUserResumeUseCase();
export const disableUserResumeController = new DisableUserResumeController(
  disableUserResumeUseCase
);
export const disableUserResumeMiddleware = new DisableUserResumeMiddleware();
