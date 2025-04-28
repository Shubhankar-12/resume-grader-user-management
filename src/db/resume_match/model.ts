import { model } from "mongoose";
import { ResumeMatchSchema } from "./schema";
import { IResumeMatchDocument } from "./types";

const resumeMatchModel = model<IResumeMatchDocument>(
  "resume_match",
  ResumeMatchSchema,
  "resume_matchs"
);

export { resumeMatchModel };
