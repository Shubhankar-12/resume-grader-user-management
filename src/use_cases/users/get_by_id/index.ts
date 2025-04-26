import { GetUserByIdMiddleware } from "./middleware";
import { GetUserByIdUseCase } from "./usecase";
import { GetUserByIdController } from "./controller";

const getUserByIdUseCase = new GetUserByIdUseCase();
export const getUserByIdController = new GetUserByIdController(
  getUserByIdUseCase
);
export const getUserByIdMiddleware = new GetUserByIdMiddleware();
