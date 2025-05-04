import { BaseMiddleware } from "../../../base_classes/BaseMiddleware";
import { MiddleWareFunctionType } from "../../../helpers";
import { getAllValidator } from "./validator";

export class GetDashboardStatsByIdMiddleware extends BaseMiddleware {
  ensureValidation(): MiddleWareFunctionType {
    return getAllValidator.validate();
  }
}
