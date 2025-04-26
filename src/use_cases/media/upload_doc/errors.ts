import { UseCaseError } from "../../../interfaces";

export class DocNotUploadedError extends UseCaseError {
  constructor(field: string) {
    super("DocNotUploadedError", "The doc has not been uploaded to S3", field);
  }
}

export class NoDocUploadedError extends UseCaseError {
  constructor(field: string) {
    super("NoDocUploadedError", "Please upload an doc file", field);
  }
}

export class UnauthorizedRequest extends UseCaseError {
  constructor() {
    super(
      "UnauthorizedRequest",
      "Unauthorized Request, please login and try again.",
      ""
    );
  }
}

export class EmployeeNotFound extends UseCaseError {
  constructor() {
    super(
      "EmployeeNotFound",
      "Employee not found, please login and try again.",
      ""
    );
  }
}
