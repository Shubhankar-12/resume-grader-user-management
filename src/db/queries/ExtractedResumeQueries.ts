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

  async getResmesByUserId(data: any): Promise<any[]> {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        userId: new ObjectId(data.userId),
        status: {
          $ne: "DISABLED",
        },
      },
    });

    if (data.search) {
      const dataSearch = data.search
        ? data.search.replace(/[()]/g, "\\$&")
        : "";
      aggregateQuery.push({
        $match: {
          "resume.name": {
            $regex: dataSearch,
            $options: "i",
          },
        },
      });
    }

    aggregateQuery.push({
      $sort: {
        created_on: -1,
      },
    });

    aggregateQuery.push({
      $project: {
        _id: 0,
        resume_id: "$_id",
        user_id: 1,
        resume: 1,
        extractedText: 1,
        analysis: 1,
        status: 1,
        created_on: 1,
        updated_on: 1,
      },
    });

    const $facet: any = {
      paginatedResults: [],
      totalCount: [{ $count: "count" }],
    };

    if (data.skip != undefined) {
      $facet.paginatedResults.push({ $skip: data.skip });
    }

    if (data.limit != undefined) {
      $facet.paginatedResults.push({ $limit: data.limit });
    }

    aggregateQuery.push({ $facet });

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
