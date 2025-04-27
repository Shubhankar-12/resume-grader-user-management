import { UseCaseError } from "../../../interfaces";

export class UserNotFoundError extends UseCaseError {
  constructor(id: string, field: string) {
    super("UserNotFoundError", `The user with id ${id} does not exist`, field);
  }
}

// RESUME_EXTRACTION_FAILED
export class ResumeExtractionFailedError extends UseCaseError {
  constructor() {
    super(
      "ResumeExtractionFailedError",
      "Could not extract text from the uploaded resume.",
      "resume"
    );
  }
}

// AI_ANALYSIS_FAILED
export class AIAnalysisFailedError extends UseCaseError {
  constructor() {
    super("AIAnalysisFailedError", "AI analysis failed.", "resume");
  }
}
// EXTRACTED_RESUME_NOT_FOUND
export class ExtractedResumeNotFoundError extends UseCaseError {
  constructor() {
    super(
      "ExtractedResumeNotFoundError",
      "The extracted resume was not found.",
      "resume"
    );
  }
}

// INTERNAL_SERVER_ERROR
export class InternalServerError extends UseCaseError {
  constructor() {
    super(
      "InternalServerError",
      "An unexpected error occurred. Please try again later.",
      "resume"
    );
  }
}
