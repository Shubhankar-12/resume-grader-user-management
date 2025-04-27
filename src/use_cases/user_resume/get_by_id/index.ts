import { GetReportByResumeIdMiddleware } from "./middleware";
import { GetReportByResumeIdUseCase } from "./usecase";
import { GetReportByResumeIdController } from "./controller";

const getReportByResumeIdUseCase = new GetReportByResumeIdUseCase();
export const getReportByResumeIdController = new GetReportByResumeIdController(
  getReportByResumeIdUseCase
);
export const getReportByResumeIdMiddleware =
  new GetReportByResumeIdMiddleware();
