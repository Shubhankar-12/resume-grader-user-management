import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { createReportValidator } from "./validator";

export class CreateReportMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return createReportValidator.validate();
  }
}
