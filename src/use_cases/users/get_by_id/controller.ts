import { BaseController } from "../../../base_classes/BaseController";
import { Request, Response } from "express";
import { GetUserByIdUseCase } from "./usecase";
import { GetUserDtoConverter } from "./dto";
import { IGetUserQuery } from "./request";
import { logUseCaseError } from "../../../logger";

export class GetUserByIdController extends BaseController {
  private getUserByIdUseCase: GetUserByIdUseCase;

  constructor(getUserByIdUseCase: GetUserByIdUseCase) {
    super();
    this.getUserByIdUseCase = getUserByIdUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as IGetUserQuery;
    const dtoObj = new GetUserDtoConverter(query);
    const result = await this.getUserByIdUseCase.execute({
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
