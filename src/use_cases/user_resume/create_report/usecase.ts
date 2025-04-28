import { extractedResumeQueries, reportQueries } from "../../../db";
import { generateResumeReportFromExtractedText } from "../../../helpers/resumeAnalyzerAI";
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from "../../../interfaces";
import { logUnexpectedUsecaseError } from "../../../logger";
import { InternalServerError } from "../create/errors";
import { ICreateReportDto } from "./dto";
import {
  ReportAlreadyExistsError,
  ExtractedResumeNotFoundError,
  ResumeExtractionFailedError,
} from "./errors";

type Response = Either<UseCaseError, any>;

export class CreateReportUseCase
  implements UseCase<ICreateReportDto, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: ICreateReportDto): Promise<Response> {
    try {
      const existingReport = await reportQueries.getReportByResumeId(
        request.resume_id
      );

      if (existingReport.length > 0) {
        return errClass(
          new ReportAlreadyExistsError(request.resume_id, "resume_id")
        );
      }

      const extractedResume =
        await extractedResumeQueries.getExtractedResumebyResumeId(request);
      if (extractedResume.length === 0) {
        return errClass(
          new ExtractedResumeNotFoundError(request.resume_id, "resume_id")
        );
      }

      const extractedResumeData = extractedResume[0];
      const createReportData = await generateResumeReportFromExtractedText(
        extractedResumeData
      );
      if (!createReportData) {
        return errClass(
          new ResumeExtractionFailedError(request.resume_id, "resume_id")
        );
      }

      const createdReport = await reportQueries.create({
        ...createReportData,
        resume_id: request.resume_id,
      });
      if (!createdReport) {
        return errClass(new InternalServerError());
      }
      return successClass({
        report_id: createdReport._id,
        resume_id: createdReport.resume_id,
        overallGrade: createdReport.overallGrade,
        scoreOutOf100: createdReport.scoreOutOf100,
        scoreBreakdown: createdReport.scoreBreakdown,
        strengths: createdReport.strengths,
        areasForImprovement: createdReport.areasForImprovement,
        keywordAnalysis: createdReport.keywordAnalysis,
        actionableSuggestions: createdReport.actionableSuggestions,
        projectAnalysis: createdReport.projectAnalysis,
        certificationAnalysis: createdReport.certificationAnalysis,
        interestAnalysis: createdReport.interestAnalysis,
        status: createdReport.status,
        created_on: createdReport.created_on,
        updated_on: createdReport.updated_on,
      });
    } catch (error) {
      console.error("Unexpected error in CreateReportUseCase:", error);
      return errClass(new InternalServerError());
    }
  }
}
