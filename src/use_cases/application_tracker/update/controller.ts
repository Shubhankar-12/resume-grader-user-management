import { BaseController } from '../../../base_classes';
import {
  Request, Response,
} from 'express';
import { UpdateApplicationUseCase } from './usecase';
import { UpdateApplicationDtoConverter } from './dto';
import { IUpdateApplicationRequest } from './request';
import { logUseCaseError } from '../../../logger';

class UpdateApplicationController extends BaseController {
  private updateApplicationUseCase: UpdateApplicationUseCase;

  constructor(updateApplicationUseCase: UpdateApplicationUseCase) {
    super();
    this.updateApplicationUseCase = updateApplicationUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: IUpdateApplicationRequest = req.body;
    const dtoObj = new UpdateApplicationDtoConverter(data);
    const result = await this.updateApplicationUseCase.execute(
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
      res.locals.response = this.success(result.value);
    }
    return;
  }
}

export { UpdateApplicationController };
