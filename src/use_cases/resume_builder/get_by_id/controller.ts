// src/use_cases/resume_builder/get_by_id/controller.ts
import { BaseController } from '../../../base_classes';
import { Request, Response } from 'express';
import { GetResumeDraftByIdUseCase } from './usecase';
import { GetResumeDraftByIdDtoConverter } from './dto';
import { logUseCaseError } from '../../../logger';
class GetResumeDraftByIdController extends BaseController {
  private useCase: GetResumeDraftByIdUseCase;
  constructor(useCase: GetResumeDraftByIdUseCase) { super(); this.useCase = useCase; }
  async executeImpl(req: Request, res: Response): Promise<void> {
    const dtoObj = new GetResumeDraftByIdDtoConverter({ resume_draft_id: req.query.resume_draft_id as string });
    const result = await this.useCase.execute(dtoObj.getDtoObject());
    if (result.isErrClass()) {
      logUseCaseError([result.value], { level: 'error' }, res);
      res.locals.response = this.fail({ errors: result.value, message: 'Not Found', statusCode: 404 });
    } else {
      res.locals.response = this.success(result.value);
    }
  }
}
export { GetResumeDraftByIdController };
