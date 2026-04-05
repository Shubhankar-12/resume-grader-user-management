import { BaseController } from '../../../base_classes';
import {
  Request, Response,
} from 'express';
import { ReorderApplicationUseCase } from './usecase';
import { ReorderApplicationDtoConverter } from './dto';
import { IReorderApplicationRequest } from './request';
import { logUseCaseError } from '../../../logger';

class ReorderApplicationController extends BaseController {
  private reorderApplicationUseCase: ReorderApplicationUseCase;

  constructor(reorderApplicationUseCase: ReorderApplicationUseCase) {
    super();
    this.reorderApplicationUseCase = reorderApplicationUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: IReorderApplicationRequest = req.body;
    const dtoObj = new ReorderApplicationDtoConverter(data);
    const result = await this.reorderApplicationUseCase.execute(
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

export { ReorderApplicationController };
