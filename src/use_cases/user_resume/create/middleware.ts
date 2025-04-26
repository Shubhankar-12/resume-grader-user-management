import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { createUserResumeValidator } from "./validator";

export class CreateUserResumeMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return createUserResumeValidator.validate();
  }
}
