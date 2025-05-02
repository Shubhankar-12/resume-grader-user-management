import { BaseController } from "../../../base_classes";
import { Request, Response } from "express";
import { CreateProjectAnalysisUseCase } from "./usecase";
import { CreateProjectAnalysisDtoConverter } from "./dto";
import { ICreateProjectAnalysisRequest } from "./request";
import { logUseCaseError } from "../../../logger";

class CreateProjectAnalysisController extends BaseController {
  private createProjectAnalysisUseCase: CreateProjectAnalysisUseCase;

  constructor(createProjectAnalysisUseCase: CreateProjectAnalysisUseCase) {
    super();
    this.createProjectAnalysisUseCase = createProjectAnalysisUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: ICreateProjectAnalysisRequest = req.body;
    const dtoObj = new CreateProjectAnalysisDtoConverter(data);
    const result = await this.createProjectAnalysisUseCase.execute({
      request: dtoObj.getDtoObject(),
      auth: res.locals.auth,
    });
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

export { CreateProjectAnalysisController };
