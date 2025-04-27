import {
  extractedResumeQueries,
  userQueries,
  userResumeQueries,
} from "../../../db";
import { IUserResumeDocument } from "../../../db/user_resume";
import {
  getResumeScoreAndSuggestions,
  getResumeExtractedFields,
} from "../../../helpers/resumeAnalyzerAI";
import { extractTextFromPdf } from "../../../helpers/utils";
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from "../../../interfaces";
import { logUnexpectedUsecaseError } from "../../../logger";
import { IDisableUserResumeDto } from "./dto";
import {
  AIAnalysisFailedError,
  ExtractedResumeNotFoundError,
  InternalServerError,
  ResumeExtractionFailedError,
  UserNotFoundError,
} from "./errors";

type Response = Either<UseCaseError, any>;

export class DisableUserResumeUseCase
  implements UseCase<IDisableUserResumeDto, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: IDisableUserResumeDto): Promise<Response> {
    try {
      // 3. Disable resume record in DB
      const disabledResume = await userResumeQueries.updateResume(request);

      return successClass({
        resume_id: disabledResume._id,
        user_id: disabledResume.user_id,
        analysis: disabledResume.analysis,
        resume: disabledResume.resume,
        disabled_on: disabledResume.disabled_on,
        updated_on: disabledResume.updated_on,
      });
    } catch (error) {
      console.error("Unexpected error in usecase:", error);
      return errClass(new InternalServerError());
    }
  }
}
