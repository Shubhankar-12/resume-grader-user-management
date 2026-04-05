import { BaseMiddleware } from '../../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../../helpers';
import { updateApplicationValidator } from './validator';

export class UpdateApplicationMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return updateApplicationValidator.validate();
  }
}
