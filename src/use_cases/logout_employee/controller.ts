import { BaseController } from '../../base_classes/BaseController';
import {
  Request,
  Response,
} from 'express';
import { LogoutUserUseCase } from './usecase';
import { logUseCaseError } from '../../logger';

class LogoutUserController extends BaseController {
  private LogoutUserUseCase: LogoutUserUseCase;

  constructor(
      LogoutUserUseCase: LogoutUserUseCase
  ) {
    super();
    this.LogoutUserUseCase = LogoutUserUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const result = await this.LogoutUserUseCase.execute(
        res.locals.auth
    );
    if (result.isSuccessClass()) {
      res.locals.response = this.created(result.value);
    } else {
      logUseCaseError(
          [result.value], { level: 'error' }, res);
      res.locals.response = this.fail(
          {
            errors: result.value,
            message: 'Invalid Request',
            statusCode: 400,
          });
    }
    return;
  }
}

export { LogoutUserController as LogoutUserController };
