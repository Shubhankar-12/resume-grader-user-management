import { BaseMiddleware } from '../../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../../helpers';
import { disableApplicationValidator } from './validator';

export class DisableApplicationMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return disableApplicationValidator.validate();
  }
}
