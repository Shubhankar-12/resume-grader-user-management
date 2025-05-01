import { CreateProjectAnalysisMiddleware } from "./middleware";
import { CreateProjectAnalysisUseCase } from "./usecase";
import { CreateProjectAnalysisController } from "./controller";

const createProjectAnalysisUseCase = new CreateProjectAnalysisUseCase();
export const createProjectAnalysisController =
  new CreateProjectAnalysisController(createProjectAnalysisUseCase);
export const createProjectAnalysisMiddleware =
  new CreateProjectAnalysisMiddleware();
