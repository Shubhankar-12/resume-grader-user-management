import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { getAllUserResumesValidator } from "./validator";

export class GetAllCoverLettersMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return getAllUserResumesValidator.validate();
  }
}
