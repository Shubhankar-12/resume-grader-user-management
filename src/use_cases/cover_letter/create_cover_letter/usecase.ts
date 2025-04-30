import { extractedResumeQueries, coverLetterQueries } from "../../../db";
import { generateResumeCoverLetterFromExtractedText } from "../../../helpers/resumeAnalyzerAI";
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from "../../../interfaces";
import { logUnexpectedUsecaseError } from "../../../logger";
import { InternalServerError } from "../../user_resume/create/errors";
import { ICreateCoverLetterDto } from "./dto";
import {
  CoverLetterAlreadyExistsError,
  ExtractedResumeNotFoundError,
  ResumeExtractionFailedError,
} from "./errors";

type Response = Either<UseCaseError, any>;

export class CreateCoverLetterUseCase
  implements UseCase<ICreateCoverLetterDto, Response>
{
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
          new ExtractedResumeNotFoundError(request.resume_id, "resume_id")
        );
      }

      const extractedResumeData = extractedResume[0];

      const createCoverLetterData =
        await generateResumeCoverLetterFromExtractedText(
          extractedResumeData,
          request.job_description,
          request.role,
          request.company
        );
      if (!createCoverLetterData) {
        return errClass(
          new ResumeExtractionFailedError(request.resume_id, "resume_id")
        );
      }

      const createdCoverLetter = await coverLetterQueries.create({
        ...createCoverLetterData,
        resume_id: request.resume_id,
        user_id: request.user_id,
        role: request.role,
        company: request.company,
        job_description: request.job_description.trim().toLowerCase(),
      });
      if (!createdCoverLetter) {
        return errClass(new InternalServerError());
      }
      return successClass({
        cover_letter_id: createdCoverLetter._id,
        resume_id: createdCoverLetter.resume_id,
        user_id: createdCoverLetter.user_id,
        role: createdCoverLetter.role,
        company: createdCoverLetter.company,
        job_description: createdCoverLetter.job_description,
        cover_letter: createdCoverLetter.cover_letter,
        cover_letter_summary: createdCoverLetter.cover_letter_summary,
        status: createdCoverLetter.status,
        created_on: createdCoverLetter.created_on,
        updated_on: createdCoverLetter.updated_on,
      });
    } catch (error) {
      console.error("Unexpected error in CreateCoverLetterUseCase:", error);
      return errClass(new InternalServerError());
    }
  }
}
