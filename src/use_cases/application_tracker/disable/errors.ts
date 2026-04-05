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
