import { UseCaseError } from '../../../interfaces';

export class JobNotFoundError extends UseCaseError {
  constructor(field: string) {
    super('JobNotFoundError', 'The job was not found', field);
  }
}
