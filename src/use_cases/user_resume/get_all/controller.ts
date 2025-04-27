import { BaseController } from "../../../base_classes";
import { Request, Response } from "express";
import { GetAllUserResumesUseCase } from "./usecase";
import { GetAllUserResumesDtoConverter } from "./dto";
import { IGetAllUserResumesQueryParam } from "./request";
import { logUseCaseError } from "../../../logger";

class GetAllUserResumesController extends BaseController {
  private getAllUserResumesUseCase: GetAllUserResumesUseCase;

  constructor(getAllUserResumesUseCase: GetAllUserResumesUseCase) {
    super();
    this.getAllUserResumesUseCase = getAllUserResumesUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const queryParams: IGetAllUserResumesQueryParam =
      req.query as unknown as IGetAllUserResumesQueryParam;
    const dtoObj = new GetAllUserResumesDtoConverter(queryParams);
    const result = await this.getAllUserResumesUseCase.execute(
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

export { GetAllUserResumesController };
