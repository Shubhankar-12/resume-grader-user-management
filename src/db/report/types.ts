import { Document, Model } from "mongoose";

interface IScoreBreakdown {
  atsCompatibility: number;
  keywordMatch: number;
  contentQuality: number;
  formatting: number;
}

interface IStrengthOrImprovement {
  title: string;
  description: string;
}

interface IKeywordAnalysis {
  presentKeywords: string[];
  missingKeywords: string[];
}

interface IActionableSuggestion {
  title: string;
  description: string;
  block: string; // HTML as string
}

interface AnalysisItem {
  title: string;
  description: string;
}

interface ProjectAnalysis {
  strengths: AnalysisItem[];
  areasForImprovement: AnalysisItem[];
}

interface CertificationAnalysis {
  strengths: AnalysisItem[];
  areasForImprovement: AnalysisItem[];
  recommendedCertifications: string[];
}

interface InterestAnalysis {
  relevance: number;
  comments: string;
  suggestions: string[];
}

interface IReport {
  resume_id: string;

  overallGrade: string;
  scoreOutOf100: number;
  scoreBreakdown: IScoreBreakdown;

  strengths: IStrengthOrImprovement[];
  areasForImprovement: IStrengthOrImprovement[];

  keywordAnalysis: IKeywordAnalysis;

  actionableSuggestions: IActionableSuggestion[];
  projectAnalysis: ProjectAnalysis;
  certificationAnalysis: CertificationAnalysis;
  interestAnalysis: InterestAnalysis;
  status: "ENABLED" | "DISABLED";

  created_on?: Date;
  updated_on?: Date;
}

interface IReportDocument extends IReport, Document {}

type IReportModel = Model<IReportDocument>;

export { IReport, IReportDocument, IReportModel };
