/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from "mongodb";
import {
  IExtractedResume,
  IExtractedResumeDocument,
  IExtractedResumeModel,
} from "../extracted_resume/types";

export class ExtractedResumeQueries {
  private extractedResumeModel: IExtractedResumeModel;

  constructor(extractedResumeModel: IExtractedResumeModel) {
    this.extractedResumeModel = extractedResumeModel;
  }

  async create(user: any): Promise<any> {
    return await this.extractedResumeModel.create(user);
  }

  async getExtractedResumebyResumeId(data: any): Promise<any[]> {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        resume_id: new ObjectId(data.resume_id),
        status: {
          $ne: "DISABLED",
        },
      },
    });

    aggregateQuery.push({
      $sort: {
        created_on: -1,
      },
    });

    aggregateQuery.push({
      $project: {
        _id: 0,
        category: 1,
        name: 1,
        summary: 1,
        email: 1,
        phone: 1,
        location: 1,
        skills: 1,
        experience: 1,
        education: 1,
        projects: 1,
        achievments: 1,
        certifications: 1,
        languages: 1,
        intrests: 1,
      },
    });

    const result = await this.extractedResumeModel.aggregate(aggregateQuery);

    return result;
  }

  async updateResume(data: any): Promise<any> {
    const filter = { _id: data.resume_id };
    return await this.extractedResumeModel.updateOne(filter, {
      $set: data,
    });
  }
}
