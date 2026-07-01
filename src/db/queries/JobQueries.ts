import { ObjectId } from 'mongodb';
import { FilterQuery, Types } from 'mongoose';
import {
  IJobDocument, IJobModel, JobStatus, JobType,
} from '../job/types';
import { jobModel } from '../job';

export class JobQueries {
  private model: IJobModel;

  constructor(model: IJobModel) {
    this.model = model;
  }

  async create(data: {
    user_id: Types.ObjectId;
    type: JobType;
    input: Record<string, unknown>;
  }): Promise<IJobDocument> {
    return this.model.create({
      ...data,
      status: 'pending',
      attempts: 0,
    });
  }

  async getById(jobId: string): Promise<IJobDocument | null> {
    return this.model.findById(jobId);
  }

  async getByIdAndUserId(
      jobId: string,
      userId: string
  ): Promise<IJobDocument | null> {
    return this.model.findOne({
      _id: new ObjectId(jobId),
      user_id: new ObjectId(userId),
    } as FilterQuery<IJobDocument>);
  }

  async updateStatus(
      jobId: string,
      status: JobStatus,
      updates?: { result?: Record<string, unknown>; error?: string }
  ): Promise<IJobDocument | null> {
    const updateData: Record<string, unknown> = { status };
    if (updates?.result) updateData.result = updates.result;
    if (updates?.error) updateData.error = updates.error;
    if (status === 'completed' || status === 'failed') {
      updateData.completed_on = new Date();
    }
    return this.model.findByIdAndUpdate(jobId, updateData, { new: true });
  }

  async incrementAttempts(jobId: string): Promise<void> {
    await this.model.findByIdAndUpdate(jobId, { $inc: { attempts: 1 } });
  }
}

export const jobQueries = new JobQueries(jobModel);
