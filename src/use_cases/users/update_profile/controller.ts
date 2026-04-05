import { BaseController } from '../../../base_classes';
import {
  Request, Response,
} from 'express';
import { UpdateProfileUseCase } from './usecase';
import { UpdateProfileDtoConverter } from './dto';
import { IUpdateProfileRequest } from './request';
import { logUseCaseError } from '../../../logger';

class UpdateProfileController extends BaseController {
  private updateProfileUseCase: UpdateProfileUseCase;

  constructor(updateProfileUseCase: UpdateProfileUseCase) {
    super();
    this.updateProfileUseCase = updateProfileUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: IUpdateProfileRequest = req.body;
    const dtoObj = new UpdateProfileDtoConverter(data);
    const result = await this.updateProfileUseCase.execute({
      auth: res.locals.auth,
      request: dtoObj.getDtoObject(),
    });
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

export { UpdateProfileController };
