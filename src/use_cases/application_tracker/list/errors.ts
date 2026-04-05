import { UseCaseError } from '../../../interfaces';

export class ApplicationsNotFoundError extends UseCaseError {
  constructor(id: string, field: string) {
    super(
        'ApplicationsNotFoundError',
        `No applications found for user with id ${id}`,
        field
    );
  }
}
