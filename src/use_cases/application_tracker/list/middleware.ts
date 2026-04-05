import { BaseMiddleware } from '../../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../../helpers';
import { listApplicationsValidator } from './validator';

export class ListApplicationsMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return listApplicationsValidator.validate();
  }
}
