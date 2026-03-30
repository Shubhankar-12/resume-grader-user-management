import { jobQueries } from '../../../db/queries/JobQueries';
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { IGetJobStatusDto } from './dto';
import { JobNotFoundError } from './errors';

type Response = Either<UseCaseError, any>;

export class GetJobStatusUseCase
implements UseCase<IGetJobStatusDto, Response> {
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: IGetJobStatusDto): Promise<Response> {
    const job = await jobQueries.getByIdAndUserId(
        request.job_id,
        request.user_id
    );

    if (!job) {
      return errClass(new JobNotFoundError('job_id'));
    }

    return successClass({
      job_id: job._id,
      type: job.type,
      status: job.status,
      input: job.input,
      result: job.result,
      error: job.error,
      attempts: job.attempts,
      created_on: job.created_on,
      completed_on: job.completed_on,
    });
  }
}
