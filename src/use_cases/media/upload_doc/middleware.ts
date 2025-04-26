import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { uploadDocValidator } from "./validator";

export class UploadDocMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return uploadDocValidator.validate();
  }
}
