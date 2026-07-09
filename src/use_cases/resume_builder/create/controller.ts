// src/use_cases/resume_builder/create/controller.ts
import { BaseController } from '../../../base_classes';
import { Request, Response } from 'express';
import { CreateResumeDraftUseCase } from './usecase';
import { CreateResumeDraftDtoConverter } from './dto';
import { ICreateResumeDraftRequest } from './request';
import { logUseCaseError } from '../../../logger';

class CreateResumeDraftController extends BaseController {
  private useCase: CreateResumeDraftUseCase;
  constructor(useCase: CreateResumeDraftUseCase) {
    super();
    this.useCase = useCase;
  }
  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: ICreateResumeDraftRequest = req.body;
    const dtoObj = new CreateResumeDraftDtoConverter(data);
    const result = await this.useCase.execute(dtoObj.getDtoObject());
    if (result.isErrClass()) {
      logUseCaseError([result.value], { level: 'error' }, res);
      res.locals.response = this.fail({ errors: result.value, message: 'Invalid Request', statusCode: 400 });
    } else {
      res.locals.response = this.created(result.value);
    }
  }
}
export { CreateResumeDraftController };
