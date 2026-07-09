// src/use_cases/resume_builder/get_by_id/errors.ts
import { UseCaseError } from '../../../interfaces';
export class InternalServerError extends UseCaseError {
  constructor() {
    super('InternalServerError', 'An unexpected error occurred', 'resume_draft');
  }
}
export class NotFoundError extends UseCaseError {
  constructor() {
    super('NotFoundError', 'Resume draft not found', 'resume_draft');
  }
}
