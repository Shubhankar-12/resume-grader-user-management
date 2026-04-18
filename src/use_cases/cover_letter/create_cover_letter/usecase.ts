import {
  extractedResumeQueries, coverLetterQueries,
} from '../../../db';
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { InternalServerError } from '../../user_resume/create/errors';
import { ICreateCoverLetterDto } from './dto';
import {
  ExtractedResumeNotFoundError,
} from './errors';
import { jobQueries } from '../../../db/queries/JobQueries';
import { enqueueJob } from '../../../jobs/queue';
import type { CreditContext } from '../../../common_middleware/creditMiddleware';
import mongoose from 'mongoose';

type Response = Either<UseCaseError, any>;

interface CreateCoverLetterArgs {
  dto: ICreateCoverLetterDto;
  creditContext?: CreditContext;
}

export class CreateCoverLetterUseCase
implements UseCase<CreateCoverLetterArgs, Response> {
  @logUnexpectedUsecaseError({ level: "error" })
  async execute({ dto: request, creditContext }: CreateCoverLetterArgs): Promise<Response> {
    try {
      const existingCoverLetter =
        await coverLetterQueries.getCoverLetterbyResumeId({
          resume_id: request.resume_id,
          job_description: request.job_description.trim().toLowerCase(),
        });

      if (existingCoverLetter.length > 0) {
        return successClass(existingCoverLetter[0]);
      }

      const extractedResume =
        await extractedResumeQueries.getExtractedResumebyResumeId(request);
      if (extractedResume.length === 0) {
        return errClass(
            new ExtractedResumeNotFoundError(request.resume_id, 'resume_id')
        );
      }

      const job = await jobQueries.create({
        user_id: mongoose.Types.ObjectId(request.user_id),
        type: "cover-letter",
        input: {
          resume_id: request.resume_id,
          job_description: request.job_description,
          role: request.role,
          company: request.company,
        },
      });

      // Use the credit-middleware's preJobId as the BullMQ job id so the ledger
      // consumption entry and any later refund share the same reference id.
      const bullJobId = creditContext?.preJobId;

      await enqueueJob(
          "cover-letter",
          {
            jobId: job._id.toString(),
            resume_id: request.resume_id,
            user_id: request.user_id,
            job_description: request.job_description,
            role: request.role,
            company: request.company,
            ...(creditContext ? { __credits: creditContext } : {}),
          },
          bullJobId ? { jobId: bullJobId } : undefined
      );

      return successClass({ job_id: job._id });
    } catch (error) {
      console.error('Unexpected error in CreateCoverLetterUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
