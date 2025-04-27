import { extractedResumeModel } from "../extracted_resume";
import { loginModel } from "../login";
import { reportModel } from "../report";
import { userModel } from "../user";
import { userResumeModel } from "../user_resume";
import { ExtractedResumeQueries } from "./ExtractedResumeQueries";
import { LoginQueries } from "./LoginQueries";
import { ReportQueries } from "./ReportQueries";
import { UserQueries } from "./UserQueries";
import { UserResumeQueries } from "./UserResumeQueries";
export const loginQueries = new LoginQueries(loginModel);
export const userQueries = new UserQueries(userModel);
export const userResumeQueries = new UserResumeQueries(userResumeModel);
export const extractedResumeQueries = new ExtractedResumeQueries(
  extractedResumeModel
);
export const reportQueries = new ReportQueries(reportModel);
