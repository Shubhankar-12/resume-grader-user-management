import { BaseController } from "../../../base_classes/BaseController";
import { Request, Response } from "express";
import { GetReportByResumeIdUseCase } from "./usecase";
import { GetReportDtoConverter } from "./dto";
import { IGetReportQuery } from "./request";
import { logUseCaseError } from "../../../logger";

export class GetReportByResumeIdController extends BaseController {
  private getReportByResumeIdUseCase: GetReportByResumeIdUseCase;

  constructor(getReportByResumeIdUseCase: GetReportByResumeIdUseCase) {
    super();
    this.getReportByResumeIdUseCase = getReportByResumeIdUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as IGetReportQuery;
    const dtoObj = new GetReportDtoConverter(query);
    const result = await this.getReportByResumeIdUseCase.execute({
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
