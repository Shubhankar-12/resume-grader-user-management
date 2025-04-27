import { BaseController } from "../../../base_classes";
import { Request, Response } from "express";
import { DisableUserResumeUseCase } from "./usecase";
import { DisableUserResumeDtoConverter } from "./dto";
import { IDisableUserResumeRequest } from "./request";
import { logUseCaseError } from "../../../logger";

class DisableUserResumeController extends BaseController {
  private disableUserResumeUseCase: DisableUserResumeUseCase;

  constructor(disableUserResumeUseCase: DisableUserResumeUseCase) {
    super();
    this.disableUserResumeUseCase = disableUserResumeUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: IDisableUserResumeRequest = req.body;
    const dtoObj = new DisableUserResumeDtoConverter(data);
    const result = await this.disableUserResumeUseCase.execute(
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

export { DisableUserResumeController };
