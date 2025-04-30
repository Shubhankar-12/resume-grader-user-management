import { CreateCoverLetterMiddleware } from "./middleware";
import { CreateCoverLetterUseCase } from "./usecase";
import { CreateCoverLetterController } from "./controller";

const createCoverLetterUseCase = new CreateCoverLetterUseCase();
export const createCoverLetterController = new CreateCoverLetterController(
  createCoverLetterUseCase
);
export const createCoverLetterMiddleware = new CreateCoverLetterMiddleware();
