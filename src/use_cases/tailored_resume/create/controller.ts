import { BaseController } from "../../../base_classes";
import { Request, Response } from "express";
import { CreateTailoredResumeUseCase } from "./usecase";
import { CreateTailoredResumeDtoConverter } from "./dto";
import { ICreateTailoredResumeRequest } from "./request";
import { logUseCaseError } from "../../../logger";

class CreateTailoredResumeController extends BaseController {
  private createTailoredResumeUseCase: CreateTailoredResumeUseCase;

  constructor(createTailoredResumeUseCase: CreateTailoredResumeUseCase) {
    super();
    this.createTailoredResumeUseCase = createTailoredResumeUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: ICreateTailoredResumeRequest = req.body;
    const dtoObj = new CreateTailoredResumeDtoConverter(data);
    const result = await this.createTailoredResumeUseCase.execute(
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

export { CreateTailoredResumeController };
