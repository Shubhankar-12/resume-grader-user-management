import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { createTailoredResumeValidator } from "./validator";

export class CreateTailoredResumeMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return createTailoredResumeValidator.validate();
  }
}
