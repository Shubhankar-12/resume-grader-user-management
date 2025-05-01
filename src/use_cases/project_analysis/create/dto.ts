import { ICreateProjectAnalysisRequest } from "./request";

export interface ICreateProjectAnalysisDto {
  user_id: string;
  role: string;
  projects: {
    id: number;
    name: string;
    description: string;
    stars: number;
    language: string;
    languageColor: string;
    topics: string[];
    updated_at: string;
    additional_comments?: string;
  }[];
}

export class CreateProjectAnalysisDtoConverter {
  private output_object: ICreateProjectAnalysisDto;
  constructor(data: ICreateProjectAnalysisRequest) {
    this.output_object = {
      user_id: data.user_id,
      role: data.role,
      projects: data.projects,
    };
  }
  public getDtoObject(): ICreateProjectAnalysisDto {
    return this.output_object;
  }
}
