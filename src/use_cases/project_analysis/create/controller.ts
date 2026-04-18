import { BaseController } from '../../../base_classes';
import {
  Request, Response,
} from 'express';
import { CreateProjectAnalysisUseCase } from './usecase';
import { CreateProjectAnalysisDtoConverter } from './dto';
import { ICreateProjectAnalysisRequest } from './request';
import { logUseCaseError } from '../../../logger';
import { refundCreditsOnInfraError } from '../../../common_middleware/creditMiddleware';

class CreateProjectAnalysisController extends BaseController {
  private createProjectAnalysisUseCase: CreateProjectAnalysisUseCase;

  constructor(createProjectAnalysisUseCase: CreateProjectAnalysisUseCase) {
    super();
    this.createProjectAnalysisUseCase = createProjectAnalysisUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: ICreateProjectAnalysisRequest = req.body;
    const dtoObj = new CreateProjectAnalysisDtoConverter(data);
    try {
      const result = await this.createProjectAnalysisUseCase.execute({
        request: dtoObj.getDtoObject(),
        auth: res.locals.auth,
      });
      if (result.isErrClass()) {
        logUseCaseError([result.value], { level: 'error' }, res);
        res.locals.response = this.fail({
          errors: result.value,
          message: 'Invalid Request',
          statusCode: 400,
        });
      } else {
        res.locals.response = this.created(result.value);
      }
    } catch (err) {
      // Sync AI path — if the provider / network failed, refund the credits
      // that `requireCredits` already deducted, then let BaseController format
      // the 500 response.
      await refundCreditsOnInfraError(res, err);
      throw err;
    }
    return;
  }
}

export { CreateProjectAnalysisController };
