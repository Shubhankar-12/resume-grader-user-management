import { BaseParser } from "../../../base_classes";
import { TailoredResumeValidator } from "../TailoredResumeValidator";

export class GetAllParser extends BaseParser {
  private tailoredResumeValidator: TailoredResumeValidator;

  constructor(
    request: any,
    query: any,
    tailoredResumeValidator: TailoredResumeValidator
  ) {
    super();
    this.tailoredResumeValidator = tailoredResumeValidator;
    this.parseTailoredResumeId(query.tailoredResume_id);
  }
  parseTailoredResumeId(value: any): void {
    const result = this.tailoredResumeValidator.validateId(
      "tailoredResume_id",
      value
    );
    this.pushIfError(result);
  }
}
