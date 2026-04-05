import { UseCaseError } from '../../../interfaces';

export class UserNotFoundError extends UseCaseError {
  constructor(id: string, field: string) {
    super(
      'UserNotFoundError',
      `The user with id ${id} does not exist`,
      field
    );
  }
}

export class ProfileUpdateFailedError extends UseCaseError {
  constructor() {
    super(
      'ProfileUpdateFailedError',
      'Failed to update the user profile.',
      'user_id'
    );
  }
}
