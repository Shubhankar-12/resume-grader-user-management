// src/use_cases/resume_builder/update/middleware.ts
import { BaseMiddleware } from '../../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../../helpers';
import { updateResumeDraftValidator } from './validator';
export class UpdateResumeDraftMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return updateResumeDraftValidator.validate();
  }
}
