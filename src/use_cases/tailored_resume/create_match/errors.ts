import { UseCaseError } from "../../../interfaces";

export class ResumeNotFoundError extends UseCaseError {
  constructor(id: string, field: string) {
    super(
      "ResumeNotFoundError",
      `The resume with id ${id} does not exist`,
      field
    );
  }
}

// REPORT ALREADY EXISTS
export class MatchReportAlreadyExistsError extends UseCaseError {
  constructor(id: string, field: string) {
    super(
      "MatchReportAlreadyExistsError",
      `The tailoredResume with resume id ${id} already exists`,
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
