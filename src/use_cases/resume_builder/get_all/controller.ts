// src/use_cases/resume_builder/get_all/controller.ts
import { BaseController } from '../../../base_classes';
import { Request, Response } from 'express';
import { GetAllResumeDraftsUseCase } from './usecase';
import { GetAllResumeDraftsDtoConverter } from './dto';
import { logUseCaseError } from '../../../logger';
class GetAllResumeDraftsController extends BaseController {
  private useCase: GetAllResumeDraftsUseCase;
  constructor(useCase: GetAllResumeDraftsUseCase) { super(); this.useCase = useCase; }
  async executeImpl(req: Request, res: Response): Promise<void> {
    const dtoObj = new GetAllResumeDraftsDtoConverter({ user_id: req.query.user_id as string });
    const result = await this.useCase.execute(dtoObj.getDtoObject());
    if (result.isErrClass()) {
      logUseCaseError([result.value], { level: 'error' }, res);
      res.locals.response = this.fail({ errors: result.value, message: 'Invalid Request', statusCode: 400 });
    } else {
      res.locals.response = this.success(result.value);
    }
  }
}
export { GetAllResumeDraftsController };
