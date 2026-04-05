import { BaseMiddleware } from '../../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../../helpers';
import { reorderApplicationValidator } from './validator';

export class ReorderApplicationMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return reorderApplicationValidator.validate();
  }
}
