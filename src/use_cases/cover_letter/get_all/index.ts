import { GetAllCoverLettersMiddleware } from "./middleware";
import { GetAllCoverLettersUseCase } from "./usecase";
import { GetAllCoverLettersController } from "./controller";

const getAllCoverLettersUseCase = new GetAllCoverLettersUseCase();
export const getAllCoverLettersController = new GetAllCoverLettersController(
  getAllCoverLettersUseCase
);
export const getAllCoverLettersMiddleware = new GetAllCoverLettersMiddleware();
