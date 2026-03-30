import { BaseMiddleware } from '../../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../../helpers';
import { getJobStatusValidator } from './validator';

export class GetJobStatusMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return getJobStatusValidator.validate();
  }
}
