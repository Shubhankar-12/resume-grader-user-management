import { CreateReportMiddleware } from "./middleware";
import { CreateReportUseCase } from "./usecase";
import { CreateReportController } from "./controller";

const createReportUseCase = new CreateReportUseCase();
export const createReportController = new CreateReportController(
  createReportUseCase
);
export const createReportMiddleware = new CreateReportMiddleware();
