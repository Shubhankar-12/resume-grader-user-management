import { BaseController } from '../../../base_classes';
import {
  Request, Response,
} from 'express';
import { GetJobStatusUseCase } from './usecase';
import { GetJobStatusDtoConverter } from './dto';
import { IGetJobStatusQuery } from './request';
import { logUseCaseError } from '../../../logger';

class GetJobStatusController extends BaseController {
  private getJobStatusUseCase: GetJobStatusUseCase;

  constructor(getJobStatusUseCase: GetJobStatusUseCase) {
    super();
    this.getJobStatusUseCase = getJobStatusUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as IGetJobStatusQuery;
    const userId = res.locals.auth.decoded_token.user?.id;
    const dtoObj = new GetJobStatusDtoConverter(query, userId as string);
    const result = await this.getJobStatusUseCase.execute(
        dtoObj.getDtoObject()
    );
    if (result.isErrClass()) {
      logUseCaseError([result.value], { level: 'error' }, res);
      res.locals.response = this.fail({
        errors: result.value,
        message: 'Job not found',
        statusCode: 404,
      });
    } else {
      res.locals.response = this.success(result.value);
    }
    return;
  }
}

export { GetJobStatusController };
