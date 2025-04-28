import { BaseController } from "../../../base_classes";
import { Request, Response } from "express";
import { CreateMatchReportUseCase } from "./usecase";
import { CreateMatchReportDtoConverter } from "./dto";
import { ICreateMatchReportRequest } from "./request";
import { logUseCaseError } from "../../../logger";

class CreateMatchReportController extends BaseController {
  private createMatchReportUseCase: CreateMatchReportUseCase;

  constructor(createMatchReportUseCase: CreateMatchReportUseCase) {
    super();
    this.createMatchReportUseCase = createMatchReportUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: ICreateMatchReportRequest = req.body;
    const dtoObj = new CreateMatchReportDtoConverter(data);
    const result = await this.createMatchReportUseCase.execute(
      dtoObj.getDtoObject()
    );
    if (result.isErrClass()) {
      logUseCaseError([result.value], { level: "error" }, res);
      res.locals.response = this.fail({
        errors: result.value,
        message: "Invalid Request",
        statusCode: 400,
      });
    } else {
      res.locals.response = this.created(result.value);
    }
    return;
  }
}

export { CreateMatchReportController };
