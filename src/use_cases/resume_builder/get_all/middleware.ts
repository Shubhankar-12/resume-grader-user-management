// src/use_cases/resume_builder/get_all/middleware.ts
import { BaseMiddleware } from '../../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../../helpers';
import { getAllResumeDraftsValidator } from './validator';
export class GetAllResumeDraftsMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return getAllResumeDraftsValidator.validate();
  }
}
