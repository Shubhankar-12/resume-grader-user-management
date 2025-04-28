import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { getAllTailoredResumesValidator } from "./validator";

export class GetAllTailoredResumesMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return getAllTailoredResumesValidator.validate();
  }
}
