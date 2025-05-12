import { coverLetterModel } from "../cover_letter";
import { extractedResumeModel } from "../extracted_resume";
import { loginModel } from "../login";
import { paymentSubscriptionModel } from "../payment_subscription";
import { projectAnalysisModel } from "../project_analysis";
import { reportModel } from "../report";
import { resumeMatchModel } from "../resume_match";
import { tailoredResumeModel } from "../tailored_resume";
import { userModel } from "../user";
import { userResumeModel } from "../user_resume";
import { CoverLetterQueries } from "./CoverLetterQueries";
import { ExtractedResumeQueries } from "./ExtractedResumeQueries";
import { LoginQueries } from "./LoginQueries";
import { PaymentSubscriptionQueries } from "./PaymentSubscriptionQueries";
import { ProjectAnalysisQueries } from "./ProjectAnalysisQueries";
import { ReportQueries } from "./ReportQueries";
import { ResumeMatchQueries } from "./ResumeMatchQueries";
import { TailoredResumeQueries } from "./TailoredResumeQueries";
import { UserQueries } from "./UserQueries";
import { UserResumeQueries } from "./UserResumeQueries";
export const loginQueries = new LoginQueries(loginModel);
export const userQueries = new UserQueries(userModel);
export const userResumeQueries = new UserResumeQueries(userResumeModel);
export const extractedResumeQueries = new ExtractedResumeQueries(
  extractedResumeModel
);
export const tailoredResumeQueries = new TailoredResumeQueries(
  tailoredResumeModel
);
export const reportQueries = new ReportQueries(reportModel);
export const resumeMatchQueries = new ResumeMatchQueries(resumeMatchModel);
export const coverLetterQueries = new CoverLetterQueries(coverLetterModel);
export const projectAnalysisQueries = new ProjectAnalysisQueries(
  projectAnalysisModel
);
export const paymentSubscriptionQueries = new PaymentSubscriptionQueries(
  paymentSubscriptionModel
);
