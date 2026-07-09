// src/use_cases/resume_builder/get_by_id/middleware.ts
import { BaseMiddleware } from '../../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../../helpers';
import { getResumeDraftByIdValidator } from './validator';
export class GetResumeDraftByIdMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return getResumeDraftByIdValidator.validate();
  }
}
