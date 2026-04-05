import { UseCaseError } from '../../../interfaces';

export class ApplicationNotFoundError extends UseCaseError {
  constructor(id: string, field: string) {
    super(
        'ApplicationNotFoundError',
        `The application with id ${id} does not exist`,
        field
    );
  }
}

export class InvalidApplicationStatusError extends UseCaseError {
  constructor(status: string, field: string) {
    super(
        'InvalidApplicationStatusError',
        `The status "${status}" is not a valid application status`,
        field
    );
  }
}
