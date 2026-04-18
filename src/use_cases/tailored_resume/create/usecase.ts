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
import type { CreditContext } from '../../../common_middleware/creditMiddleware';
import mongoose from 'mongoose';

type Response = Either<UseCaseError, any>;

interface CreateTailoredResumeArgs {
  dto: ICreateTailoredResumeDto;
  creditContext?: CreditContext;
}

export class CreateTailoredResumeUseCase
implements UseCase<CreateTailoredResumeArgs, Response> {
  @logUnexpectedUsecaseError({ level: "error" })
  async execute({ dto: request, creditContext }: CreateTailoredResumeArgs): Promise<Response> {
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

      // Use the credit-middleware's preJobId as the BullMQ job id so the ledger
      // consumption entry and any later refund share the same reference id.
      const bullJobId = creditContext?.preJobId;

      await enqueueJob(
          "tailored-resume",
          {
            jobId: job._id.toString(),
            resume_id: request.resume_id,
            user_id: request.user_id,
            job_description: request.job_description,
            ...(creditContext ? { __credits: creditContext } : {}),
          },
          bullJobId ? { jobId: bullJobId } : undefined
      );

      return successClass({ job_id: job._id });
    } catch (error) {
      console.error('Unexpected error in CreateTailoredResumeUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
