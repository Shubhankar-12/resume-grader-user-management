import {
  extractedResumeQueries, tailoredResumeQueries,
} from '../../../db';
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { ICreateTailoredResumeDto } from './dto';
import { ResumeNotFoundError } from './errors';
import { InternalServerError } from '../../user_resume/create/errors';
import { jobQueries } from '../../../db/queries/JobQueries';
import { enqueueJob } from '../../../jobs/queue';
import mongoose from 'mongoose';

type Response = Either<UseCaseError, any>;

export class CreateTailoredResumeUseCase
implements UseCase<ICreateTailoredResumeDto, Response> {
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: ICreateTailoredResumeDto): Promise<Response> {
    try {
      const existingResume =
        await extractedResumeQueries.getExtractedResumebyResumeId(request);

      if (existingResume.length == 0) {
        return errClass(
            new ResumeNotFoundError(request.resume_id, 'resume_id')
        );
      }

      const existingTailoredResume =
        await tailoredResumeQueries.getTailoredResumebyResumeId({
          resume_id: request.resume_id,
          job_description: request.job_description.trim().toLowerCase(),
        });

      if (existingTailoredResume.length > 0) {
        return successClass(existingTailoredResume[0]);
      }

      const job = await jobQueries.create({
        user_id: mongoose.Types.ObjectId(request.user_id),
        type: "tailored-resume",
        input: {
          resume_id: request.resume_id,
          job_description: request.job_description,
        },
      });

      await enqueueJob("tailored-resume", {
        jobId: job._id.toString(),
        resume_id: request.resume_id,
        user_id: request.user_id,
        job_description: request.job_description,
      });

      return successClass({ job_id: job._id });
    } catch (error) {
      console.error('Unexpected error in CreateTailoredResumeUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
