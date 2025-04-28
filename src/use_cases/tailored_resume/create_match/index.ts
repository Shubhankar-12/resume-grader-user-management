import { CreateMatchReportMiddleware } from "./middleware";
import { CreateMatchReportUseCase } from "./usecase";
import { CreateMatchReportController } from "./controller";

const createMatchReportUseCase = new CreateMatchReportUseCase();
export const createMatchReportController = new CreateMatchReportController(
  createMatchReportUseCase
);
export const createMatchReportMiddleware = new CreateMatchReportMiddleware();
