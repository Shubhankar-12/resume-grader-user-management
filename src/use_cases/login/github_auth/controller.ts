import { BaseController } from "../../../base_classes/BaseController";
import { Request, Response } from "express";
import { GithubAuthUseCase } from "./usecase";
import { GithubAuthDtoConverter } from "./dto";
import { IGithubAuthRequest } from "./request";
import { logUseCaseError } from "../../../logger";

export class GithubAuthController extends BaseController {
  private GithubAuthUseCase: GithubAuthUseCase;

  constructor(GithubAuthUseCase: GithubAuthUseCase) {
    super();
    this.GithubAuthUseCase = GithubAuthUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const dtoObj = new GithubAuthDtoConverter(
      req.body as unknown as IGithubAuthRequest
    );

    const result = await this.GithubAuthUseCase.execute(dtoObj.getDtoObject());
    if (result.isSuccessClass()) {
      res.cookie("token", result.value.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
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
