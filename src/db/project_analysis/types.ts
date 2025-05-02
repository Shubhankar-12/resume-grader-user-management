import { Document, Model } from "mongoose";

interface Project {
  id: number;
  name: string;
  description: string;
  stars: number;
  language: string;
  languageColor: string;
  topics: string[];
  updated_at: string;
  ai_score: number; // Score from 0–100
  relevance: string; // e.g. HIGH, MEDIUM, LOW
  reason: string;
  additional_comments: string;
  key_points: string[];
}

interface IProjectAnalysis {
  user_id: string;
  role: string;
  project_ids: number[];
  selected_project: Project[];
  status: string;
}

interface IProjectAnalysisDocument extends IProjectAnalysis, Document {}

type IProjectAnalysisModel = Model<IProjectAnalysisDocument>;

export { IProjectAnalysis, IProjectAnalysisDocument, IProjectAnalysisModel };
