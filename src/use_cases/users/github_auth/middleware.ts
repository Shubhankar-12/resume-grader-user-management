import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { loginUserValidator } from "./validator";

export class GithubUpdateMiddleware extends BaseMiddleware {
  ensureAuthorization(): MiddleWareFunctionType {
    throw new Error("function not implemented yet");
  }

  ensureValidation(): MiddleWareFunctionType {
    return loginUserValidator.validate();
  }
}
