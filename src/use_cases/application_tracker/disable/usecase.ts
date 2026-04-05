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
import { IDisableApplicationDto } from './dto';
import { ApplicationNotFoundError } from './errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = Either<UseCaseError, any>;

export class DisableApplicationUseCase
implements UseCase<IDisableApplicationDto, Response> {
  @logUnexpectedUsecaseError({ level: 'error' })
  async execute(request: IDisableApplicationDto): Promise<Response> {
    try {
      const result = await applicationQueries.disable(
          request.application_id,
          request.user_id
      );
      if (!result) {
        return errClass(
            new ApplicationNotFoundError(
                request.application_id,
                'application_id'
            )
        );
      }
      return successClass({ success: true });
    } catch (error) {
      console.error('Unexpected error in DisableApplicationUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
