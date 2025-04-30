import { BaseController } from "../../../base_classes";
import { Request, Response } from "express";
import { GetAllCoverLettersUseCase } from "./usecase";
import { GetAllCoverLettersDtoConverter } from "./dto";
import { IGetAllCoverLettersQueryParam } from "./request";
import { logUseCaseError } from "../../../logger";

class GetAllCoverLettersController extends BaseController {
  private getAllCoverLettersUseCase: GetAllCoverLettersUseCase;

  constructor(getAllCoverLettersUseCase: GetAllCoverLettersUseCase) {
    super();
    this.getAllCoverLettersUseCase = getAllCoverLettersUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const queryParams: IGetAllCoverLettersQueryParam =
      req.query as unknown as IGetAllCoverLettersQueryParam;
    const dtoObj = new GetAllCoverLettersDtoConverter(queryParams);
    const result = await this.getAllCoverLettersUseCase.execute(
      dtoObj.getDtoObject()
    );
    if (result.isErrClass()) {
      logUseCaseError([result.value], { level: "error" }, res);
      res.locals.response = this.fail({
        errors: [result.value],
        message: "Invalid Request",
        statusCode: 400,
      });
    } else {
      res.locals.response = this.success(result.value.paginatedResults, {
        message: "",
        total_documents: result.value.totalCount[0].count,
      });
    }
    return;
  }
}

export { GetAllCoverLettersController };
