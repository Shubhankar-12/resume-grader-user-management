import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { getAllUserResumesValidator } from "./validator";

export class GetAllUserResumesMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return getAllUserResumesValidator.validate();
  }
}
