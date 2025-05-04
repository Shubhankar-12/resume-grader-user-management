import { GetDashboardStatsByIdMiddleware } from "./middleware";
import { GetDashboardStatsByIdUseCase } from "./usecase";
import { GetDashboardStatsByIdController } from "./controller";

const getDashboardStatsByIdUseCase = new GetDashboardStatsByIdUseCase();
export const getDashboardStatsByIdController =
  new GetDashboardStatsByIdController(getDashboardStatsByIdUseCase);
export const getDashboardStatsByIdMiddleware =
  new GetDashboardStatsByIdMiddleware();
