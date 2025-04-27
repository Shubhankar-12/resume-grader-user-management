import { CreateTailoredResumeMiddleware } from "./middleware";
import { CreateTailoredResumeUseCase } from "./usecase";
import { CreateTailoredResumeController } from "./controller";

const createTailoredResumeUseCase = new CreateTailoredResumeUseCase();
export const createTailoredResumeController =
  new CreateTailoredResumeController(createTailoredResumeUseCase);
export const createTailoredResumeMiddleware =
  new CreateTailoredResumeMiddleware();
