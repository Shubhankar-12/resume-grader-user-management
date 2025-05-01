import { UpdateCoverLetterMiddleware } from "./middleware";
import { UpdateCoverLetterUseCase } from "./usecase";
import { UpdateCoverLetterController } from "./controller";

const updateCoverLetterUseCase = new UpdateCoverLetterUseCase();
export const updateCoverLetterController = new UpdateCoverLetterController(
  updateCoverLetterUseCase
);
export const updateCoverLetterMiddleware = new UpdateCoverLetterMiddleware();
