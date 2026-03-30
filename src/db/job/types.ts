import { Document, Model, Types } from "mongoose";

export const JOB_TYPES = [
  "resume-grade",
  "cover-letter",
  "tailored-resume",
] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const JOB_STATUSES = [
  "pending",
  "processing",
  "completed",
  "failed",
] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export interface IJob {
  user_id: Types.ObjectId;
  type: JobType;
  status: JobStatus;
  input: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  attempts: number;
  completed_on?: Date;
  created_on?: Date;
  updated_on?: Date;
}

export interface IJobDocument extends IJob, Document {}
export type IJobModel = Model<IJobDocument>;
