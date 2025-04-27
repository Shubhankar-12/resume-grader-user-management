import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { disableUserResumeValidator } from "./validator";

export class DisableUserResumeMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return disableUserResumeValidator.validate();
  }
}
