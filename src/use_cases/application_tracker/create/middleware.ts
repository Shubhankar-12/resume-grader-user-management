import { BaseMiddleware } from '../../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../../helpers';
import { createApplicationValidator } from './validator';

export class CreateApplicationMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return createApplicationValidator.validate();
  }
}
