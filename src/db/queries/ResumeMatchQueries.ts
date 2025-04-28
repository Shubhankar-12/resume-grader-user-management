/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from "mongodb";
import {
  IResumeMatch,
  IResumeMatchDocument,
  IResumeMatchModel,
} from "../resume_match/types";

export class ResumeMatchQueries {
  private resumeMatchModel: IResumeMatchModel;

  constructor(resumeMatchModel: IResumeMatchModel) {
    this.resumeMatchModel = resumeMatchModel;
  }

  async create(user: any): Promise<any> {
    return await this.resumeMatchModel.create(user);
  }

  async getResumeMatchbyResumeId(data: any): Promise<any[]> {
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
        resume_match_id: "$_id",
        resume_id: 1,
        keyRequirements: 1,
        resumeMatchAnalysis: 1,
        updated_on: 1,
        created_on: 1,
      },
    });

    const result = await this.resumeMatchModel.aggregate(aggregateQuery);

    return result;
  }
  async getResumeMatchbyId(data: any): Promise<any[]> {
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

    const result = await this.resumeMatchModel.aggregate(aggregateQuery);

    return result;
  }

  async updateResume(data: any): Promise<any> {
    const filter = { _id: data.resume_id };
    return await this.resumeMatchModel.updateOne(filter, {
      $set: data,
    });
  }
}
