import { BaseController } from '../../../base_classes';
import {
  Request, Response,
} from 'express';
import { CreateMatchReportUseCase } from './usecase';
import { CreateMatchReportDtoConverter } from './dto';
import { ICreateMatchReportRequest } from './request';
import { logUseCaseError } from '../../../logger';
import { refundCreditsOnInfraError } from '../../../common_middleware/creditMiddleware';

class CreateMatchReportController extends BaseController {
  private createMatchReportUseCase: CreateMatchReportUseCase;

  constructor(createMatchReportUseCase: CreateMatchReportUseCase) {
    super();
    this.createMatchReportUseCase = createMatchReportUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: ICreateMatchReportRequest = req.body;
    const dtoObj = new CreateMatchReportDtoConverter(data);
    try {
      const result = await this.createMatchReportUseCase.execute(
          dtoObj.getDtoObject()
      );
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

export { CreateMatchReportController };
