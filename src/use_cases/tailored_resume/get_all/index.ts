import { GetAllTailoredResumesMiddleware } from "./middleware";
import { GetAllTailoredResumesUseCase } from "./usecase";
import { GetAllTailoredResumesController } from "./controller";

const getAllTailoredResumesUseCase = new GetAllTailoredResumesUseCase();
export const getAllTailoredResumesController =
  new GetAllTailoredResumesController(getAllTailoredResumesUseCase);
export const getAllTailoredResumesMiddleware =
  new GetAllTailoredResumesMiddleware();
