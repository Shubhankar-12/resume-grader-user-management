import { BaseMiddleware } from '../../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../../helpers';
import { updateProfileValidator } from './validator';

export class UpdateProfileMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return updateProfileValidator.validate();
  }
}
