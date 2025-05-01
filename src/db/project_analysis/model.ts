import { model } from "mongoose";
import { ProjectAnalysisSchema } from "./schema";
import { IProjectAnalysisDocument } from "./types";

const projectAnalysisModel = model<IProjectAnalysisDocument>(
  "project_analysis",
  ProjectAnalysisSchema,
  "project_analysis"
);

export { projectAnalysisModel };
