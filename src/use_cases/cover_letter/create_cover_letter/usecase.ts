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
import mongoose from 'mongoose';

type Response = Either<UseCaseError, any>;

export class CreateCoverLetterUseCase
implements UseCase<ICreateCoverLetterDto, Response> {
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: ICreateCoverLetterDto): Promise<Response> {
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

      await enqueueJob("cover-letter", {
        jobId: job._id.toString(),
        resume_id: request.resume_id,
        user_id: request.user_id,
        job_description: request.job_description,
        role: request.role,
        company: request.company,
      });

      return successClass({ job_id: job._id });
    } catch (error) {
      console.error('Unexpected error in CreateCoverLetterUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
