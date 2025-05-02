import { BaseController } from "../../../base_classes/BaseController";
import { Request, Response } from "express";
import { GithubUpdateUseCase } from "./usecase";
import { GithubUpdateDtoConverter } from "./dto";
import { IGithubUpdateRequest } from "./request";
import { logUseCaseError } from "../../../logger";

export class GithubUpdateController extends BaseController {
  private GithubUpdateUseCase: GithubUpdateUseCase;

  constructor(GithubUpdateUseCase: GithubUpdateUseCase) {
    super();
    this.GithubUpdateUseCase = GithubUpdateUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const dtoObj = new GithubUpdateDtoConverter(
      req.body as unknown as IGithubUpdateRequest
    );

    const result = await this.GithubUpdateUseCase.execute({
      request: dtoObj.getDtoObject(),
      auth: res.locals.auth,
    });
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
