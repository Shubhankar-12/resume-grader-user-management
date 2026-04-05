import { applicationQueries } from '../../../db/queries';
import { APPLICATION_STATUSES } from '../../../db/application/types';
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { InternalServerError } from '../../user_resume/create/errors';
import { IReorderApplicationDto } from './dto';
import {
  ApplicationNotFoundError,
  InvalidApplicationStatusError,
} from './errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = Either<UseCaseError, any>;

export class ReorderApplicationUseCase
implements UseCase<IReorderApplicationDto, Response> {
  @logUnexpectedUsecaseError({ level: 'error' })
  async execute(request: IReorderApplicationDto): Promise<Response> {
    try {
      if (!APPLICATION_STATUSES.includes(request.new_status)) {
        return errClass(
            new InvalidApplicationStatusError(request.new_status, 'new_status')
        );
      }
      const result = await applicationQueries.reorder(request);
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
      console.error('Unexpected error in ReorderApplicationUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
