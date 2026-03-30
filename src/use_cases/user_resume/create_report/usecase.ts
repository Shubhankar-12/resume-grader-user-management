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
import mongoose from 'mongoose';

type Response = Either<UseCaseError, any>;

export class CreateReportUseCase
implements UseCase<ICreateReportDto, Response> {
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: ICreateReportDto): Promise<Response> {
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

      await enqueueJob("resume-grade", {
        jobId: job._id.toString(),
        resume_id: request.resume_id,
        user_id: request.user_id,
      });

      return successClass({ job_id: job._id });
    } catch (error) {
      console.error('Unexpected error in CreateReportUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
