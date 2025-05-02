import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { registerUserValidator } from "./validator";

export class RegisterUserWithEmailMiddleware extends BaseMiddleware {
  ensureAuthorization(): MiddleWareFunctionType {
    throw new Error("function not implemented yet");
  }

  ensureValidation(): MiddleWareFunctionType {
    return registerUserValidator.validate();
  }
}
