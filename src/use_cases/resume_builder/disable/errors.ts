// src/use_cases/resume_builder/disable/errors.ts
import { UseCaseError } from '../../../interfaces';
export class InternalServerError extends UseCaseError {
  constructor() {
    super('InternalServerError', 'An unexpected error occurred', 'resume_draft');
  }
}
