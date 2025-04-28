import { BaseController } from "../../../base_classes/BaseController";
import { Request, Response } from "express";
import { GetTailoredResumeByIdUseCase } from "./usecase";
import { GetTailoredResumeDtoConverter } from "./dto";
import { IGetTailoredResumeQuery } from "./request";
import { logUseCaseError } from "../../../logger";

export class GetTailoredResumeByIdController extends BaseController {
  private getTailoredResumeByIdUseCase: GetTailoredResumeByIdUseCase;

  constructor(getTailoredResumeByIdUseCase: GetTailoredResumeByIdUseCase) {
    super();
    this.getTailoredResumeByIdUseCase = getTailoredResumeByIdUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as IGetTailoredResumeQuery;
    const dtoObj = new GetTailoredResumeDtoConverter(query);
    const result = await this.getTailoredResumeByIdUseCase.execute({
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
