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
import { ICreateApplicationDto } from './dto';

type Response = Either<UseCaseError, any>;

export class CreateApplicationUseCase
implements UseCase<ICreateApplicationDto, Response> {
  @logUnexpectedUsecaseError({ level: 'error' })
  async execute(request: ICreateApplicationDto): Promise<Response> {
    try {
      const application = await applicationQueries.create(request);
      return successClass(application);
    } catch (error) {
      console.error('Unexpected error in CreateApplicationUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
