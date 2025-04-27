import { model } from "mongoose";
import { ExtractedResumeSchema } from "./schema";
import { IExtractedResumeDocument } from "./types";

const extractedResumeModel = model<IExtractedResumeDocument>(
  "extracted_resume",
  ExtractedResumeSchema,
  "extracted_resumes"
);

export { extractedResumeModel };
