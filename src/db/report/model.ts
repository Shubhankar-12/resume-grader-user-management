import { model } from "mongoose";
import { ReportSchema } from "./schema";
import { IReportDocument } from "./types";

const reportModel = model<IReportDocument>("report", ReportSchema, "reports");

export { reportModel };
