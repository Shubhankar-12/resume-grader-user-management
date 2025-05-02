import { projectAnalysisQueries } from "../../../db";
import { fetchReadme } from "../../../helpers/fetchReadme";
import { generateResumeProjectAnalysis } from "../../../helpers/resumeAnalyzerAI";
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
  ResponseLocalAuth,
} from "../../../interfaces";
import { logUnexpectedUsecaseError } from "../../../logger";
import { InternalServerError } from "../../user_resume/create/errors";
import { ICreateProjectAnalysisDto } from "./dto";

import jwt from "jsonwebtoken";

type Response = Either<UseCaseError, any>;
type AnalysisRequest = {
  request: ICreateProjectAnalysisDto;
  auth: ResponseLocalAuth;
};

export class CreateProjectAnalysisUseCase
  implements UseCase<AnalysisRequest, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute({ request, auth }: AnalysisRequest): Promise<Response> {
    try {
      const req_project_ids = request.projects.map((project) => project.id);
      const existingAnalysis = await projectAnalysisQueries.getProjectAnalysis({
        ...request,
        project_ids: req_project_ids,
      });

      if (existingAnalysis.length > 0) {
        return successClass(existingAnalysis[0]);
      }
      const token = auth.token;
      const decodedToken = jwt.decode(token) as any;
      const github_username = decodedToken.user.username;

      const projectsWithReadmes = await Promise.all(
        request.projects.map(async (project) => {
          const readme = await fetchReadme(github_username, project.name);
          return {
            ...project,
            readme,
          };
        })
      );

      const analysisResult = await generateResumeProjectAnalysis(
        request.role,
        projectsWithReadmes
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
            key_points: analysis?.key_points,
          };
        });

      const creatObj = {
        user_id: request.user_id,
        role: request.role,
        selected_project: selected_projects.sort(
          (a, b) => b.ai_score - a.ai_score
        ),
        project_ids: req_project_ids,
        status: "ENABLED",
      };
      const resp = await projectAnalysisQueries.create(creatObj);
      const projectAnalysis =
        await projectAnalysisQueries.getProjectAnalysisById(resp._id);
      return successClass(projectAnalysis[0]);
    } catch (error) {
      console.error("Unexpected error in CreateProjectAnalysisUseCase:", error);
      return errClass(new InternalServerError());
    }
  }
}
