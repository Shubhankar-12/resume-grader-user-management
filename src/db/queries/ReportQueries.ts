import { ObjectId } from "mongodb";
import { IReport, IReportDocument, IReportModel } from "../report/types";

export class ReportQueries {
  private reportModel: IReportModel;

  constructor(reportModel: IReportModel) {
    this.reportModel = reportModel;
  }

  async create(report: IReport): Promise<IReportDocument> {
    return await this.reportModel.create(report);
  }

  async getReportByResumeId(resume_id: string): Promise<any> {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        resume_id: new ObjectId(resume_id),
        status: {
          $ne: "DISABLED",
        },
      },
    });

    aggregateQuery.push({
      $project: {
        _id: 0,
        report_id: "$_id",
        resume_id: 1,
        overallGrade: 1,
        scoreOutOf100: 1,
        scoreBreakdown: 1,
        strengths: 1,
        areasForImprovement: 1,
        keywordAnalysis: 1,
        projectAnalysis: 1,
        certificationAnalysis: 1,
        interestAnalysis: 1,
        actionableSuggestions: 1,
        created_on: 1,
        updated_on: 1,
      },
    });

    const report = await this.reportModel.aggregate(aggregateQuery);

    return report;
  }
}
