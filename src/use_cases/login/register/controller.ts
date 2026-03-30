import { BaseController } from '../../../base_classes/BaseController';
import {
  Request, Response,
} from 'express';
import { RegisterUserWithEmailUseCase } from './usecase';
import { RegisterOwnerDtoConverter } from './dto';
import { IRegisterUserRequest } from './request';
import { logUseCaseError } from '../../../logger';

export class RegisterUserWithEmailController extends BaseController {
  private RegisterUserUseCase: RegisterUserWithEmailUseCase;

  constructor(RegisterUserUseCase: RegisterUserWithEmailUseCase) {
    super();
    this.RegisterUserUseCase = RegisterUserUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const dtoObj = new RegisterOwnerDtoConverter(
      req.body as unknown as IRegisterUserRequest
    );

    const result = await this.RegisterUserUseCase.execute(
        dtoObj.getDtoObject()
    );
    if (result.isSuccessClass()) {
      res.cookie('token', result.value.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });
      res.locals.response = this.created(result.value);
    } else {
      logUseCaseError([result.value], { level: 'error' }, res);
      res.locals.response = this.fail({
        errors: result.value,
        message: 'Invalid Request',
        statusCode: 400,
      });
    }
    return;
  }
}
