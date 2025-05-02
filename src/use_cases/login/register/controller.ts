import { BaseController } from "../../../base_classes/BaseController";
import { Request, Response } from "express";
import { RegisterUserWithEmailUseCase } from "./usecase";
import { RegisterOwnerDtoConverter } from "./dto";
import { IRegisterUserRequest } from "./request";
import { logUseCaseError } from "../../../logger";

export class RegisterUserWithEmailController extends BaseController {
  private RegisterUserUseCase: RegisterUserWithEmailUseCase;

  constructor(RegisterUserUseCase: RegisterUserWithEmailUseCase) {
    super();
    this.RegisterUserUseCase = RegisterUserUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const dtoObj = new RegisterOwnerDtoConverter(
      req.body as unknown as IRegisterUserRequest
    );

    const result = await this.RegisterUserUseCase.execute(
      dtoObj.getDtoObject()
    );
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
