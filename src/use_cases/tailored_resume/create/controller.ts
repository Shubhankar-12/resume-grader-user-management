import { BaseController } from '../../../base_classes';
import {
  Request, Response,
} from 'express';
import { CreateTailoredResumeUseCase } from './usecase';
import { CreateTailoredResumeDtoConverter } from './dto';
import { ICreateTailoredResumeRequest } from './request';
import { logUseCaseError } from '../../../logger';
import type { CreditContext } from '../../../common_middleware/creditMiddleware';

class CreateTailoredResumeController extends BaseController {
  private createTailoredResumeUseCase: CreateTailoredResumeUseCase;

  constructor(createTailoredResumeUseCase: CreateTailoredResumeUseCase) {
    super();
    this.createTailoredResumeUseCase = createTailoredResumeUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: ICreateTailoredResumeRequest = req.body;
    const dtoObj = new CreateTailoredResumeDtoConverter(data);
    const creditContext = (res.locals as any).creditContext as
      | CreditContext
      | undefined;
    const result = await this.createTailoredResumeUseCase.execute({
      dto: dtoObj.getDtoObject(),
      creditContext,
    });
    if (result.isErrClass()) {
      logUseCaseError([result.value], { level: 'error' }, res);
      res.locals.response = this.fail({
        errors: result.value,
        message: 'Invalid Request',
        statusCode: 400,
      });
    } else if (result.value.job_id) {
      res.locals.response = {
        body: result.value,
        statusCode: 202,
        meta: {
          total_documents: 1,
          message: 'Job enqueued',
          data_type: 'application/json',
        },
        isSuccess: true,
        errors: null,
      };
    } else {
      res.locals.response = this.created(result.value);
    }
    return;
  }
}

export { CreateTailoredResumeController };
