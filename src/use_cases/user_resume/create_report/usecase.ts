import {
  extractedResumeQueries, reportQueries,
} from '../../../db';
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { InternalServerError } from '../create/errors';
import { ICreateReportDto } from './dto';
import {
  ExtractedResumeNotFoundError,
} from './errors';
import { jobQueries } from '../../../db/queries/JobQueries';
import { enqueueJob } from '../../../jobs/queue';
import type { CreditContext } from '../../../common_middleware/creditMiddleware';
import mongoose from 'mongoose';

type Response = Either<UseCaseError, any>;

interface CreateReportArgs {
  dto: ICreateReportDto;
  creditContext?: CreditContext;
}

export class CreateReportUseCase
implements UseCase<CreateReportArgs, Response> {
  @logUnexpectedUsecaseError({ level: "error" })
  async execute({ dto: request, creditContext }: CreateReportArgs): Promise<Response> {
    try {
      const existingReport = await reportQueries.getReportByResumeId(
          request.resume_id
      );

      if (existingReport.length > 0) {
        return successClass(existingReport[0]);
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
        type: "resume-grade",
        input: { resume_id: request.resume_id },
      });

      // Use the credit-middleware's preJobId as the BullMQ job id so the ledger
      // consumption entry and any later refund share the same reference id.
      const bullJobId = creditContext?.preJobId;

      await enqueueJob(
          "resume-grade",
          {
            jobId: job._id.toString(),
            resume_id: request.resume_id,
            user_id: request.user_id,
            ...(creditContext ? { __credits: creditContext } : {}),
          },
          bullJobId ? { jobId: bullJobId } : undefined
      );

      return successClass({ job_id: job._id });
    } catch (error) {
      console.error('Unexpected error in CreateReportUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
