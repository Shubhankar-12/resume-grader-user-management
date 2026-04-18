import {
  extractedResumeQueries,
  resumeMatchQueries,
  tailoredResumeQueries,
} from '../../../db';
import { generateResumeJobMatchReport } from '../../../prompts';
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { ResumeNotFoundError } from './errors';
import { ICreateMatchReportDto } from './dto';
import {
  MatchReportAlreadyExistsError,
  ExtractedResumeNotFoundError,
  ResumeExtractionFailedError,
} from './errors';
import { InternalServerError } from '../../user_resume/create/errors';

type Response = Either<UseCaseError, any>;

export class CreateMatchReportUseCase
implements UseCase<ICreateMatchReportDto, Response> {
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: ICreateMatchReportDto): Promise<Response> {
    let existingResume;
    try {
      existingResume =
        await extractedResumeQueries.getExtractedResumebyResumeId(request);

      if (existingResume.length == 0) {
        return errClass(
            new ResumeNotFoundError(request.resume_id, 'resume_id')
        );
      }

      const existingMatch = await resumeMatchQueries.getResumeMatchbyResumeId({
        resume_id: request.resume_id,
        job_description: request.job_description.trim().toLowerCase(),
      });

      if (existingMatch.length > 0) {
        return successClass(existingMatch[0]);
      }
    } catch (error) {
      console.error('Unexpected error in CreateMatchReportUseCase (pre-AI):', error);
      return errClass(new InternalServerError());
    }

    // AI call + its persistence live outside the try/catch so that infra
    // failures bubble up to the controller, which refunds credits.
    const createMatchReportData = await generateResumeJobMatchReport(
        existingResume[0],
        request.resume_id
    );

    try {
      await resumeMatchQueries.create({
        ...createMatchReportData,
        resume_id: request.resume_id,
        job_description: request.job_description.trim().toLowerCase(),
      });

      return successClass({
        resume_id: request.resume_id,
        job_description: request.job_description,
        keyRequirements: createMatchReportData.keyRequirements,
        resumeMatchAnalysis: createMatchReportData.resumeMatchAnalysis,
      });
    } catch (error) {
      console.error('Unexpected error in CreateMatchReportUseCase (post-AI):', error);
      return errClass(new InternalServerError());
    }
  }
}
