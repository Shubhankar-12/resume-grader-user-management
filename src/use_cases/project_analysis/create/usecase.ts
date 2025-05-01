import { projectAnalysisQueries } from "../../../db";
import { generateResumeProjectAnalysis } from "../../../helpers/resumeAnalyzerAI";
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from "../../../interfaces";
import { logUnexpectedUsecaseError } from "../../../logger";
import { InternalServerError } from "../../user_resume/create/errors";
import { ICreateProjectAnalysisDto } from "./dto";

type Response = Either<UseCaseError, any>;

export class CreateProjectAnalysisUseCase
  implements UseCase<ICreateProjectAnalysisDto, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: ICreateProjectAnalysisDto): Promise<Response> {
    try {
      const req_project_ids = request.projects.map((project) => project.id);
      const existingAnalysis = await projectAnalysisQueries.getProjectAnalysis({
        ...request,
        project_ids: req_project_ids,
      });

      if (existingAnalysis.length > 0) {
        return successClass(existingAnalysis[0]);
      }
      const analysisResult = await generateResumeProjectAnalysis(
        request.role,
        request.projects
      );

      const selected_projects = request.projects
        .filter((project) =>
          analysisResult.some((result) => result.id === project.id)
        )
        .map((project) => {
          const analysis = analysisResult.find(
            (result) => result.id === project.id
          );
          return {
            ...project,
            ai_score: analysis?.ai_score,
            relevance: analysis?.relevance,
            reason: analysis?.reason,
          };
        });

      const creatObj = {
        user_id: request.user_id,
        role: request.role,
        selected_project: selected_projects,
        project_ids: req_project_ids,
        status: "ENABLED",
      };
      const resp = await projectAnalysisQueries.create(creatObj);
      const projectAnalysis = await projectAnalysisQueries.getProjectAnalysis(
        resp
      );
      return successClass(projectAnalysis[0]);
    } catch (error) {
      console.error("Unexpected error in CreateProjectAnalysisUseCase:", error);
      return errClass(new InternalServerError());
    }
  }
}
