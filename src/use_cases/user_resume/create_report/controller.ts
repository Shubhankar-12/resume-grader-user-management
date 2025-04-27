import { BaseController } from "../../../base_classes";
import { Request, Response } from "express";
import { CreateReportUseCase } from "./usecase";
import { CreateReportDtoConverter } from "./dto";
import { ICreateReportRequest } from "./request";
import { logUseCaseError } from "../../../logger";

class CreateReportController extends BaseController {
  private createReportUseCase: CreateReportUseCase;

  constructor(createReportUseCase: CreateReportUseCase) {
    super();
    this.createReportUseCase = createReportUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: ICreateReportRequest = req.body;
    const dtoObj = new CreateReportDtoConverter(data);
    const result = await this.createReportUseCase.execute(
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

export { CreateReportController };
