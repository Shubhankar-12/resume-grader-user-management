import { GetAllUserResumesMiddleware } from "./middleware";
import { GetAllUserResumesUseCase } from "./usecase";
import { GetAllUserResumesController } from "./controller";

const getAllUserResumesUseCase = new GetAllUserResumesUseCase();
export const getAllUserResumesController = new GetAllUserResumesController(
  getAllUserResumesUseCase
);
export const getAllUserResumesMiddleware = new GetAllUserResumesMiddleware();
