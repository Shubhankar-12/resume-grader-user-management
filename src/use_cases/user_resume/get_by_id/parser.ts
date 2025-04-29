import { BaseParser } from "../../../base_classes";
import { UserResumeValidator } from "../UserResumeValidator";

export class GetAllParser extends BaseParser {
  private userValidator: UserResumeValidator;

  constructor(request: any, query: any, userValidator: UserResumeValidator) {
    super();
    this.userValidator = userValidator;
    this.parseUserId(query.resume_id);
  }
  parseUserId(value: any): void {
    const result = this.userValidator.validateId("resume_id", value);
    this.pushIfError(result);
  }
}
