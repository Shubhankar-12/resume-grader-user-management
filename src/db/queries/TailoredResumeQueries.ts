/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from "mongodb";
import {
  ITailoredResume,
  ITailoredResumeDocument,
  ITailoredResumeModel,
} from "../tailored_resume/types";

export class TailoredResumeQueries {
  private tailoredResumeModel: ITailoredResumeModel;

  constructor(tailoredResumeModel: ITailoredResumeModel) {
    this.tailoredResumeModel = tailoredResumeModel;
  }

  async create(user: any): Promise<any> {
    return await this.tailoredResumeModel.create(user);
  }

  async getTailoredResumebyResumeId(data: any): Promise<any[]> {
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
        tailored_resume_id: "$_id",
        resume_id: 1,
        atsScore: 1,
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
        created_on: 1,
      },
    });

    const result = await this.tailoredResumeModel.aggregate(aggregateQuery);

    return result;
  }
  async getTailoredResumebyId(data: any): Promise<any[]> {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        _id: new ObjectId(data.tailored_resume_id),
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
        job_description: 1,
        atsScore: 1,
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

    const result = await this.tailoredResumeModel.aggregate(aggregateQuery);

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

    const result = await this.tailoredResumeModel.aggregate(aggregateQuery);

    return result;
  }

  async updateResume(data: any): Promise<any> {
    const filter = { _id: data.resume_id };
    return await this.tailoredResumeModel.updateOne(filter, {
      $set: data,
    });
  }
}
