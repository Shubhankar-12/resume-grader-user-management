// src/use_cases/resume_builder/create/middleware.ts
import { BaseMiddleware } from '../../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../../helpers';
import { createResumeDraftValidator } from './validator';

export class CreateResumeDraftMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return createResumeDraftValidator.validate();
  }
}
