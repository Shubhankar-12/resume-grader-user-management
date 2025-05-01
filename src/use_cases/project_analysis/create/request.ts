/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICreateProjectAnalysisRequest {
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
