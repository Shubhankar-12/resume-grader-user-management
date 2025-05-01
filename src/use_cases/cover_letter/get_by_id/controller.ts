import { BaseController } from "../../../base_classes/BaseController";
import { Request, Response } from "express";
import { GetCoverLetterByIdUseCase } from "./usecase";
import { GetCoverLetterDtoConverter } from "./dto";
import { IGetCoverLetterQuery } from "./request";
import { logUseCaseError } from "../../../logger";

export class GetCoverLetterByIdController extends BaseController {
  private getCoverLetterByIdUseCase: GetCoverLetterByIdUseCase;

  constructor(getCoverLetterByIdUseCase: GetCoverLetterByIdUseCase) {
    super();
    this.getCoverLetterByIdUseCase = getCoverLetterByIdUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as IGetCoverLetterQuery;
    const dtoObj = new GetCoverLetterDtoConverter(query);
    const result = await this.getCoverLetterByIdUseCase.execute({
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
