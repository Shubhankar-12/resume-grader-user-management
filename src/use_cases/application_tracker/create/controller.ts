import { BaseController } from '../../../base_classes';
import {
  Request, Response,
} from 'express';
import { CreateApplicationUseCase } from './usecase';
import { CreateApplicationDtoConverter } from './dto';
import { ICreateApplicationRequest } from './request';
import { logUseCaseError } from '../../../logger';

class CreateApplicationController extends BaseController {
  private createApplicationUseCase: CreateApplicationUseCase;

  constructor(createApplicationUseCase: CreateApplicationUseCase) {
    super();
    this.createApplicationUseCase = createApplicationUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: ICreateApplicationRequest = req.body;
    const dtoObj = new CreateApplicationDtoConverter(data);
    const result = await this.createApplicationUseCase.execute(
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
    return;
  }
}

export { CreateApplicationController };
