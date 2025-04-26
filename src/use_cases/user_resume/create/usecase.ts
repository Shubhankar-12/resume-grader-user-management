import { userQueries, userResumeQueries } from "../../../db";
import { IUserResumeDocument } from "../../../db/user_resume";
import { getResumeAnalysisFromAI } from "../../../helpers/resumeAnalyzerAI";
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
      // console.log("Extracted Text:", extractedText);

      if (!extractedText) {
        return errClass(new ResumeExtractionFailedError());
      }

      // 2. Analyze the extracted text with AI
      const analysis = await getResumeAnalysisFromAI(extractedText);
      // console.log("AI Analysis:", analysis);
      if (!analysis) {
        return errClass(new AIAnalysisFailedError());
      }

      // 3. Create resume record in DB
      const createdResume = await userResumeQueries.create({
        ...request,
        extractedText: extractedText,
        analysis: analysis,
      });

      if (!createdResume) {
        return errClass(new InternalServerError());
      }

      return successClass({
        resume_id: createdResume._id,
        user_id: createdResume.user_id,
        extractedText: createdResume.extractedText,
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
