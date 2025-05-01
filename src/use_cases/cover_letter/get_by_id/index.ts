import { GetCoverLetterByIdMiddleware } from "./middleware";
import { GetCoverLetterByIdUseCase } from "./usecase";
import { GetCoverLetterByIdController } from "./controller";

const getCoverLetterByIdUseCase = new GetCoverLetterByIdUseCase();
export const getCoverLetterByIdController = new GetCoverLetterByIdController(
  getCoverLetterByIdUseCase
);
export const getCoverLetterByIdMiddleware = new GetCoverLetterByIdMiddleware();
