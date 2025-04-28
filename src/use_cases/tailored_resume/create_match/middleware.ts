import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { createMatchReportValidator } from "./validator";

export class CreateMatchReportMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return createMatchReportValidator.validate();
  }
}
