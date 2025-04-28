import { UseCaseError } from "../../../interfaces";

export class TailoredResumeNotFoundError extends UseCaseError {
  constructor(field: string) {
    super("TailoredResumeNotFoundError", "The TailoredResume not found", field);
  }
}
