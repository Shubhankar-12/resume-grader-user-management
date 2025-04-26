import { BaseController } from "../../../base_classes";
import { UploadDocUseCase } from "./usecase";
import { UploadDocDtoConverter } from "./dto";
import { IUploadDocRequest } from "./request";
import { logUseCaseError } from "../../../logger";
import { UseCaseError } from "../../../interfaces";

import { Request, Response } from "express";

class UploadDocController extends BaseController {
  private uploadDocUseCase: UploadDocUseCase;

  constructor(uploadDocUseCase: UploadDocUseCase) {
    super();
    this.uploadDocUseCase = uploadDocUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const body = req.body;
    const file = req.file;

    const dataImage: IUploadDocRequest = {
      ...body,
      ...file,
    };
    const dtoObj = new UploadDocDtoConverter(dataImage);
    const result = await this.uploadDocUseCase.execute({
      file: dtoObj.getDtoObject(),
      auth: res.locals.auth,
    });
    if (result.isErrClass()) {
      logUseCaseError(
        [result.value as unknown as UseCaseError],
        { level: "error" },
        res
      );
      res.locals.response = this.fail({
        errors: result.value,
        message: "Invalid Request",
        statusCode: 400,
      });
    } else {
      res.locals.response = this.success(result.value, {
        message: "Document added Successfully",
        total_documents: 1,
      });
    }
    return;
  }
}

export { UploadDocController };
