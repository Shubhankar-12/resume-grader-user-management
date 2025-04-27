import { UseCaseError } from "../../../interfaces";

export class UserNotFoundError extends UseCaseError {
  constructor(id: string, field: string) {
    super("UserNotFoundError", `The user with id ${id} does not exist`, field);
  }
}

// REPORT ALREADY EXISTS
export class ReportAlreadyExistsError extends UseCaseError {
  constructor(id: string, field: string) {
    super(
      "ReportAlreadyExistsError",
      `The report with resume id ${id} already exists`,
      field
    );
  }
}

// EXTRACTED RESUME NOT FOUND
export class ExtractedResumeNotFoundError extends UseCaseError {
  constructor(id: string, field: string) {
    super(
      "ExtractedResumeNotFoundError",
      `The extracted resume with id ${id} does not exist`,
      field
    );
  }
}

// RESUME EXTRACTION FAILED
export class ResumeExtractionFailedError extends UseCaseError {
  constructor(id: string, field: string) {
    super(
      "ResumeExtractionFailedError",
      `The resume with id ${id} failed to extract`,
      field
    );
  }
}
