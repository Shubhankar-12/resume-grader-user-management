import { BaseParser } from "../../../base_classes";
import { UserValidator } from "../UserValidator";

export class GetAllParser extends BaseParser {
  private userValidator: UserValidator;

  constructor(request: any, query: any, userValidator: UserValidator) {
    super();
    this.userValidator = userValidator;
    // this.parseUserId(query.user_id);
  }
  parseUserId(value: any): void {
    const result = this.userValidator.validateId("user_id", value);
    this.pushIfError(result);
  }
}
