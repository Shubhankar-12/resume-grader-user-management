import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { updateCoverLetterValidator } from "./validator";

export class UpdateCoverLetterMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return updateCoverLetterValidator.validate();
  }
}
