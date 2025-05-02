import { BaseController } from "../../../base_classes/BaseController";
import { Request, Response } from "express";
import { LoginUserWithEmailUseCase } from "./usecase";
import { LoginOwnerDtoConverter } from "./dto";
import { ILoginUserRequest } from "./request";
import { logUseCaseError } from "../../../logger";

export class LoginUserWithEmailController extends BaseController {
  private LoginUserUseCase: LoginUserWithEmailUseCase;

  constructor(LoginUserUseCase: LoginUserWithEmailUseCase) {
    super();
    this.LoginUserUseCase = LoginUserUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const dtoObj = new LoginOwnerDtoConverter(
      req.body as unknown as ILoginUserRequest
    );

    const result = await this.LoginUserUseCase.execute(dtoObj.getDtoObject());
    if (result.isSuccessClass()) {
      res.locals.response = this.created(result.value);
    } else {
      logUseCaseError([result.value], { level: "error" }, res);
      res.locals.response = this.fail({
        errors: result.value,
        message: "Invalid Request",
        statusCode: 400,
      });
    }
    return;
  }
}
