import { ObjectId } from "mongodb";
import { IProjectAnalysisModel } from "../project_analysis";

export class ProjectAnalysisQueries {
  private projectAnalysisModel: IProjectAnalysisModel;

  constructor(projectAnalysisModel: IProjectAnalysisModel) {
    this.projectAnalysisModel = projectAnalysisModel;
  }

  async create(user: any): Promise<any> {
    return await this.projectAnalysisModel.create(user);
  }

  async getProjectAnalysis(data: any) {
    let aggregateQuery: any[] = [];

    if (data.project_analysis_id) {
      aggregateQuery.push({
        $match: {
          _id: new ObjectId(data.project_analysis_id),
        },
      });
    }

    aggregateQuery.push({
      $match: {
        $expr: {
          $and: [
            { $eq: ["$user_id", new ObjectId(data.user_id)] },
            { $eq: ["$role", data.role] },
            { $ne: ["$status", "DISABLED"] },
            { $setEquals: ["$project_ids", data.project_ids] },
          ],
        },
      },
    });

    aggregateQuery.push({
      $project: {
        _id: 0,
        project_analysis_id: "$_id",
        user_id: 1,
        role: 1,
        project_ids: 1,
        selected_project: 1,
        status: 1,
      },
    });

    return await this.projectAnalysisModel.aggregate(aggregateQuery);
  }
  async getProjectAnalysisById(id: any) {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        _id: new ObjectId(id),
        status: {
          $ne: "DISABLED",
        },
      },
    });

    aggregateQuery.push({
      $project: {
        _id: 0,
        project_analysis_id: "$_id",
        user_id: 1,
        role: 1,
        project_ids: 1,
        selected_project: 1,
        status: 1,
      },
    });

    return await this.projectAnalysisModel.aggregate(aggregateQuery);
  }
}
