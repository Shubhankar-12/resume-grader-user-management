import { BaseController } from "../../../base_classes";
import { Request, Response } from "express";
import { GetAllTailoredResumesUseCase } from "./usecase";
import { GetAllTailoredResumesDtoConverter } from "./dto";
import { IGetAllTailoredResumesQueryParam } from "./request";
import { logUseCaseError } from "../../../logger";

class GetAllTailoredResumesController extends BaseController {
  private getAllTailoredResumesUseCase: GetAllTailoredResumesUseCase;

  constructor(getAllTailoredResumesUseCase: GetAllTailoredResumesUseCase) {
    super();
    this.getAllTailoredResumesUseCase = getAllTailoredResumesUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const queryParams: IGetAllTailoredResumesQueryParam =
      req.query as unknown as IGetAllTailoredResumesQueryParam;
    const dtoObj = new GetAllTailoredResumesDtoConverter(queryParams);
    const result = await this.getAllTailoredResumesUseCase.execute(
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

export { GetAllTailoredResumesController };
