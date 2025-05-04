import { BaseController } from "../../../base_classes/BaseController";
import { Request, Response } from "express";
import { GetDashboardStatsByIdUseCase } from "./usecase";
import { GetDashboardStatsDtoConverter } from "./dto";
import { IGetDashboardStatsQuery } from "./request";
import { logUseCaseError } from "../../../logger";

export class GetDashboardStatsByIdController extends BaseController {
  private getDashboardStatsByIdUseCase: GetDashboardStatsByIdUseCase;

  constructor(getDashboardStatsByIdUseCase: GetDashboardStatsByIdUseCase) {
    super();
    this.getDashboardStatsByIdUseCase = getDashboardStatsByIdUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as IGetDashboardStatsQuery;
    const dtoObj = new GetDashboardStatsDtoConverter(query);
    const result = await this.getDashboardStatsByIdUseCase.execute({
      auth: res.locals.auth,
      request: dtoObj.getDtoObject(),
    });
    if (result.isErrClass()) {
      logUseCaseError([result.value], { level: "error" }, res);
      res.locals.response = this.fail({
        errors: result.value,
        message: "Invalid Request",
        statusCode: 400,
      });
    } else {
      res.locals.response = this.success(result.value);
    }
    return;
  }
}
