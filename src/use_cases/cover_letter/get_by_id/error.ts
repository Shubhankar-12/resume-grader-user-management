import { UseCaseError } from "../../../interfaces";

export class CoverLetterNotFoundError extends UseCaseError {
  constructor(field: string) {
    super("CoverLetterNotFoundError", "The CoverLetter not found", field);
  }
}
