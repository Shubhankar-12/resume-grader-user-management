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
    this.parseTailoredResumeId(query.tailored_resume_id);
  }
  parseTailoredResumeId(value: any): void {
    const result = this.tailoredResumeValidator.validateId(
      "tailored_resume_id",
      value
    );
    this.pushIfError(result);
  }
}
