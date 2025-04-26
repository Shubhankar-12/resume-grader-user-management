import { BaseController } from "../../../base_classes";
import { Request, Response } from "express";
import { CreateUserResumeUseCase } from "./usecase";
import { CreateUserResumeDtoConverter } from "./dto";
import { ICreateUserResumeRequest } from "./request";
import { logUseCaseError } from "../../../logger";

class CreateUserResumeController extends BaseController {
  private createUserResumeUseCase: CreateUserResumeUseCase;

  constructor(createUserResumeUseCase: CreateUserResumeUseCase) {
    super();
    this.createUserResumeUseCase = createUserResumeUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: ICreateUserResumeRequest = req.body;
    const dtoObj = new CreateUserResumeDtoConverter(data);
    const result = await this.createUserResumeUseCase.execute(
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

export { CreateUserResumeController };
