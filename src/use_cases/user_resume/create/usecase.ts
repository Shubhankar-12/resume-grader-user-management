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
import { ICreateUserResumeDto } from "./dto";
import {
  AIAnalysisFailedError,
  ExtractedResumeNotFoundError,
  InternalServerError,
  ResumeExtractionFailedError,
  UserNotFoundError,
} from "./errors";

type Response = Either<UseCaseError, any>;

export class CreateUserResumeUseCase
  implements UseCase<ICreateUserResumeDto, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: ICreateUserResumeDto): Promise<Response> {
    try {
      const user = await userQueries.getUserById(request.user_id);
      if (!user) {
        return errClass(new UserNotFoundError(request.user_id, "user_id"));
      }

      const extractedText = await extractTextFromPdf(request.resume.url);
      if (!extractedText) {
        return errClass(new ResumeExtractionFailedError());
      }

      // Analyze the extracted text with AI (parallel)
      const [gradingResult, extractedFieldsResult] = await Promise.all([
        getResumeScoreAndSuggestions(extractedText),
        getResumeExtractedFields(extractedText),
      ]);

      if (!gradingResult || !extractedFieldsResult) {
        return errClass(new AIAnalysisFailedError());
      }

      // Combine into single analysis object
      const combinedAnalysis = {
        gradingScore: gradingResult.gradingScore,
        atsScore: gradingResult.atsScore,
        suggestions: gradingResult.suggestions,
        extractedFields: extractedFieldsResult,
      };

      // 3. Create resume record in DB
      const createdResume = await userResumeQueries.create({
        ...request,
        extractedText: extractedText,
        analysis: combinedAnalysis,
      });

      if (!createdResume) {
        return errClass(new InternalServerError());
      }

      // 4. Create extracted resume fields separately
      const extractedResume = await extractedResumeQueries.create({
        resume_id: createdResume._id,
        ...extractedFieldsResult,
        status: "ENABLED",
      });

      if (!extractedResume) {
        return errClass(new ExtractedResumeNotFoundError());
      }

      // await userQueries.updateUserUsage(request.user_id, "resumeUploads");

      return successClass({
        resume_id: createdResume._id,
        user_id: createdResume.user_id,
        extractedText: extractedFieldsResult,
        analysis: createdResume.analysis,
        resume: createdResume.resume,
        created_on: createdResume.created_on,
        updated_on: createdResume.updated_on,
      });
    } catch (error) {
      console.error("Unexpected error in CreateUserResumeUseCase:", error);
      return errClass(new InternalServerError());
    }
  }
}
