import { BaseParser } from "../../../base_classes";
import { UserResumeValidator } from "../UserResumeValidator";

export class GetAllParser extends BaseParser {
  private tailoredResumeValidator: UserResumeValidator;

  constructor(
    request: any,
    query: any,
    tailoredResumeValidator: UserResumeValidator
  ) {
    super();
    this.tailoredResumeValidator = tailoredResumeValidator;
    this.parseTailoredResumeId(query.cover_letter_id);
  }
  parseTailoredResumeId(value: any): void {
    const result = this.tailoredResumeValidator.validateId(
      "cover_letter_id",
      value
    );
    this.pushIfError(result);
  }
}
