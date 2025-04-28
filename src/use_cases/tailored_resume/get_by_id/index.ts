import { GetTailoredResumeByIdMiddleware } from "./middleware";
import { GetTailoredResumeByIdUseCase } from "./usecase";
import { GetTailoredResumeByIdController } from "./controller";

const getTailoredResumeByIdUseCase = new GetTailoredResumeByIdUseCase();
export const getTailoredResumeByIdController =
  new GetTailoredResumeByIdController(getTailoredResumeByIdUseCase);
export const getTailoredResumeByIdMiddleware =
  new GetTailoredResumeByIdMiddleware();
