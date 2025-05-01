import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { createValidator } from "./validator";

export class CreateProjectAnalysisMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return createValidator.validate();
  }
}
