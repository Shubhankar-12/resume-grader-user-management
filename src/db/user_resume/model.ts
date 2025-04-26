import { model } from "mongoose";
import { UserResumeSchema } from "./schema";
import { IUserResumeDocument } from "./types";

const userResumeModel = model<IUserResumeDocument>(
  "user_resume",
  UserResumeSchema,
  "user_resumes"
);

export { userResumeModel };
