import { applicationQueries } from '../../../db/queries';
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { InternalServerError } from '../../user_resume/create/errors';
import { IListApplicationsDto } from './dto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = Either<UseCaseError, any>;

export class ListApplicationsUseCase
implements UseCase<IListApplicationsDto, Response> {
  @logUnexpectedUsecaseError({ level: 'error' })
  async execute(request: IListApplicationsDto): Promise<Response> {
    try {
      const applications = await applicationQueries.getByUserId(request);
      return successClass(applications);
    } catch (error) {
      console.error('Unexpected error in ListApplicationsUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
