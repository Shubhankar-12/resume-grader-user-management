import { BaseController } from '../../../base_classes';
import {
  Request, Response,
} from 'express';
import { CreateCoverLetterUseCase } from './usecase';
import { CreateCoverLetterDtoConverter } from './dto';
import { ICreateCoverLetterRequest } from './request';
import { logUseCaseError } from '../../../logger';

class CreateCoverLetterController extends BaseController {
  private createCoverLetterUseCase: CreateCoverLetterUseCase;

  constructor(createCoverLetterUseCase: CreateCoverLetterUseCase) {
    super();
    this.createCoverLetterUseCase = createCoverLetterUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: ICreateCoverLetterRequest = req.body;
    const dtoObj = new CreateCoverLetterDtoConverter(data);
    const result = await this.createCoverLetterUseCase.execute(
        dtoObj.getDtoObject()
    );
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

export { CreateCoverLetterController };
