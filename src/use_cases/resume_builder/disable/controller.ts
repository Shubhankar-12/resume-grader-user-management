// src/use_cases/resume_builder/disable/controller.ts
import { BaseController } from '../../../base_classes';
import { Request, Response } from 'express';
import { DisableResumeDraftUseCase } from './usecase';
import { DisableResumeDraftDtoConverter } from './dto';
import { IDisableResumeDraftRequest } from './request';
import { logUseCaseError } from '../../../logger';
class DisableResumeDraftController extends BaseController {
  private useCase: DisableResumeDraftUseCase;
  constructor(useCase: DisableResumeDraftUseCase) { super(); this.useCase = useCase; }
  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: IDisableResumeDraftRequest = req.body;
    const dtoObj = new DisableResumeDraftDtoConverter(data);
    const result = await this.useCase.execute(dtoObj.getDtoObject());
    if (result.isErrClass()) {
      logUseCaseError([result.value], { level: 'error' }, res);
      res.locals.response = this.fail({ errors: result.value, message: 'Invalid Request', statusCode: 400 });
    } else {
      res.locals.response = this.success(result.value);
    }
  }
}
export { DisableResumeDraftController };
