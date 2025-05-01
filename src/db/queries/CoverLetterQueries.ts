/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from "mongodb";
import {
  ICoverLetter,
  ICoverLetterDocument,
  ICoverLetterModel,
} from "../cover_letter/types";

export class CoverLetterQueries {
  private coverLetterModel: ICoverLetterModel;

  constructor(coverLetterModel: ICoverLetterModel) {
    this.coverLetterModel = coverLetterModel;
  }

  async create(user: any): Promise<any> {
    return await this.coverLetterModel.create(user);
  }

  async getCoverLetterbyResumeId(data: any): Promise<any[]> {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        resume_id: new ObjectId(data.resume_id),
        status: {
          $ne: "DISABLED",
        },
      },
    });

    if (data.job_description) {
      aggregateQuery.push({
        $match: {
          job_description: data.job_description,
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
        cover_letter_id: "$_id",
        resume_id: 1,
        user_id: 1,
        role: 1,
        company: 1,
        job_description: 1,
        cover_letter_summary: 1,
        cover_letter: 1,
        created_on: 1,
        updated_on: 1,
      },
    });

    const result = await this.coverLetterModel.aggregate(aggregateQuery);

    return result;
  }
  async getCoverLetterbyId(data: any): Promise<any[]> {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        _id: new ObjectId(data.cover_letter_id),
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
        cover_letter_id: "$_id",
        resume_id: 1,
        user_id: 1,
        role: 1,
        company: 1,
        job_description: 1,
        cover_letter_summary: 1,
        cover_letter: 1,
        created_on: 1,
        updated_on: 1,
      },
    });

    const result = await this.coverLetterModel.aggregate(aggregateQuery);

    return result;
  }

  async getCoverLetterByUserId(data: any): Promise<any[]> {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        user_id: new ObjectId(data.user_id),
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
          $or: [
            {
              role: {
                $regex: dataSearch,
                $options: "i",
              },
            },
            {
              company: {
                $regex: dataSearch,
                $options: "i",
              },
            },
          ],
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
        cover_letter_id: "$_id",
        resume_id: 1,
        user_id: 1,
        role: 1,
        company: 1,
        job_description: 1,
        cover_letter: 1,
        cover_letter_summary: 1,
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

    const result = await this.coverLetterModel.aggregate(aggregateQuery);

    return result;
  }

  async updateCoverLetter(data: any): Promise<any> {
    const filter = { _id: data.cover_letter_id };
    return await this.coverLetterModel.updateOne(filter, {
      $set: data,
    });
  }
}
