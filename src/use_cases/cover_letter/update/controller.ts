import { BaseController } from "../../../base_classes";
import { Request, Response } from "express";
import { UpdateCoverLetterUseCase } from "./usecase";
import { UpdateCoverLetterDtoConverter } from "./dto";
import { IUpdateCoverLetterRequest } from "./request";
import { logUseCaseError } from "../../../logger";

class UpdateCoverLetterController extends BaseController {
  private updateCoverLetterUseCase: UpdateCoverLetterUseCase;

  constructor(updateCoverLetterUseCase: UpdateCoverLetterUseCase) {
    super();
    this.updateCoverLetterUseCase = updateCoverLetterUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: IUpdateCoverLetterRequest = req.body;
    const dtoObj = new UpdateCoverLetterDtoConverter(data);
    const result = await this.updateCoverLetterUseCase.execute(
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

export { UpdateCoverLetterController };
