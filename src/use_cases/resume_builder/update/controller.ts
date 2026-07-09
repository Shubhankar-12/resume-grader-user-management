// src/use_cases/resume_builder/update/controller.ts
import { BaseController } from '../../../base_classes';
import { Request, Response } from 'express';
import { UpdateResumeDraftUseCase } from './usecase';
import { UpdateResumeDraftDtoConverter } from './dto';
import { IUpdateResumeDraftRequest } from './request';
import { logUseCaseError } from '../../../logger';
class UpdateResumeDraftController extends BaseController {
  private useCase: UpdateResumeDraftUseCase;
  constructor(useCase: UpdateResumeDraftUseCase) { super(); this.useCase = useCase; }
  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: IUpdateResumeDraftRequest = req.body;
    const dtoObj = new UpdateResumeDraftDtoConverter(data);
    const result = await this.useCase.execute(dtoObj.getDtoObject());
    if (result.isErrClass()) {
      logUseCaseError([result.value], { level: 'error' }, res);
      res.locals.response = this.fail({ errors: result.value, message: 'Invalid Request', statusCode: 400 });
    } else {
      res.locals.response = this.success(result.value);
    }
  }
}
export { UpdateResumeDraftController };
