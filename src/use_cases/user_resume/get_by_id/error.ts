import { UseCaseError } from "../../../interfaces";

export class ReportNotFoundError extends UseCaseError {
  constructor(field: string) {
    super("ReportNotFoundError", "The Report not found", field);
  }
}
