import { BaseController } from '../../../base_classes';
import {
  Request, Response,
} from 'express';
import { DisableApplicationUseCase } from './usecase';
import { DisableApplicationDtoConverter } from './dto';
import { IDisableApplicationRequest } from './request';
import { logUseCaseError } from '../../../logger';

class DisableApplicationController extends BaseController {
  private disableApplicationUseCase: DisableApplicationUseCase;

  constructor(disableApplicationUseCase: DisableApplicationUseCase) {
    super();
    this.disableApplicationUseCase = disableApplicationUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: IDisableApplicationRequest = req.body;
    const dtoObj = new DisableApplicationDtoConverter(data);
    const result = await this.disableApplicationUseCase.execute(
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

export { DisableApplicationController };
