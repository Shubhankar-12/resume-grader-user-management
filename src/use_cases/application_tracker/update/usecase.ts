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
import { IUpdateApplicationDto } from './dto';
import { ApplicationNotFoundError } from './errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = Either<UseCaseError, any>;

export class UpdateApplicationUseCase
implements UseCase<IUpdateApplicationDto, Response> {
  @logUnexpectedUsecaseError({ level: 'error' })
  async execute(request: IUpdateApplicationDto): Promise<Response> {
    try {
      const existing = await applicationQueries.getById(
          request.application_id
      );
      if (!existing) {
        return errClass(
            new ApplicationNotFoundError(
                request.application_id,
                'application_id'
            )
        );
      }
      await applicationQueries.update(request);
      return successClass({ success: true });
    } catch (error) {
      console.error('Unexpected error in UpdateApplicationUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
