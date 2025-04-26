import { UploadDocMiddleware } from "./middleware";
import { UploadDocUseCase } from "./usecase";
import { UploadDocController } from "./controller";

const uploadDocUseCase = new UploadDocUseCase();
export const uploadDocController = new UploadDocController(uploadDocUseCase);
export const uploadDocMiddleware = new UploadDocMiddleware();
