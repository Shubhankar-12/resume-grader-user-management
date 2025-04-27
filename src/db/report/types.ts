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

interface IReport {
  resume_id: string;

  overallGrade: string;
  scoreOutOf100: number;
  scoreBreakdown: IScoreBreakdown;

  strengths: IStrengthOrImprovement[];
  areasForImprovement: IStrengthOrImprovement[];

  keywordAnalysis: IKeywordAnalysis;

  actionableSuggestions: IActionableSuggestion[];

  status: "ENABLED" | "DISABLED";

  created_on?: Date;
  updated_on?: Date;
}

interface IReportDocument extends IReport, Document {}

type IReportModel = Model<IReportDocument>;

export { IReport, IReportDocument, IReportModel };
