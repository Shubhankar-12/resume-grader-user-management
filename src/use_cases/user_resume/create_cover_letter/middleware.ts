import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { createCoverLetterValidator } from "./validator";

export class CreateCoverLetterMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return createCoverLetterValidator.validate();
  }
}
