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
import { IUpdateCoverLetterDto } from "./dto";
import {
  CoverLetterAlreadyExistsError,
  CoverLetterNotFoundError,
  ExtractedResumeNotFoundError,
  ResumeExtractionFailedError,
} from "./errors";

type Response = Either<UseCaseError, any>;

export class UpdateCoverLetterUseCase
  implements UseCase<IUpdateCoverLetterDto, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: IUpdateCoverLetterDto): Promise<Response> {
    try {
      const existingCoverLetter = await coverLetterQueries.getCoverLetterbyId(
        request
      );

      if (existingCoverLetter.length == 0) {
        return errClass(
          new CoverLetterNotFoundError(
            request.cover_letter_id,
            "cover_letter_id"
          )
        );
      }

      await coverLetterQueries.updateCoverLetter(request);
      const updatedCoverLetter = await coverLetterQueries.getCoverLetterbyId(
        request
      );

      return successClass(updatedCoverLetter[0]);
    } catch (error) {
      console.error("Unexpected error in UpdateCoverLetterUseCase:", error);
      return errClass(new InternalServerError());
    }
  }
}
