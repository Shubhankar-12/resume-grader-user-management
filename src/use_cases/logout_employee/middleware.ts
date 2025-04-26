import { BaseMiddleware } from '../../base_classes/BaseMiddleware';
import { MiddleWareFunctionType } from '../../helpers';
export class LogoutUserMiddleware extends BaseMiddleware {
  ensureAuthorization():MiddleWareFunctionType {
    throw new Error('Function not yet implemented');
  }

  ensureValidation():MiddleWareFunctionType {
    throw new Error('Function not yet implemented');
  }
}
