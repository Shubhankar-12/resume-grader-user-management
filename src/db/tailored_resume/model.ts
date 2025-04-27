import { model } from "mongoose";
import { TailoredResumeSchema } from "./schema";
import { ITailoredResumeDocument } from "./types";

const tailoredResumeModel = model<ITailoredResumeDocument>(
  "tailored_resume",
  TailoredResumeSchema,
  "tailored_resumes"
);

export { tailoredResumeModel };
