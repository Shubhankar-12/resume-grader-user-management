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

  async getResmesByUserId(data: any): Promise<any[]> {
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
      $lookup: {
        from: "extracted_resumes",
        localField: "_id",
        foreignField: "resume_id",
        as: "extracted_resume",
      },
    });

    aggregateQuery.push({
      $unwind: {
        path: "$extracted_resume",
        preserveNullAndEmptyArrays: true,
      },
    });

    aggregateQuery.push({
      $project: {
        _id: 0,
        tailored_resume_id: "$_id",
        atsScore: 1,
        user_id: 1,
        category: 1,
        job_description: 1,
        cover_letter_summary: 1,
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
        created_on: 1,
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
