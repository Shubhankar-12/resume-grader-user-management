// src/use_cases/resume_builder/disable/middleware.ts
import { BaseMiddleware } from '../../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../../helpers';
import { disableResumeDraftValidator } from './validator';
export class DisableResumeDraftMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return disableResumeDraftValidator.validate();
  }
}
