import { UseCaseError } from '../../../interfaces';

export class ApplicationCreationFailedError extends UseCaseError {
  constructor() {
    super(
        'ApplicationCreationFailedError',
        'Failed to create the application.',
        'application'
    );
  }
}
