import { Schema } from 'mongoose';
import {
  IJobDocument, JOB_TYPES, JOB_STATUSES,
} from './types';

export const JobSchema = new Schema<IJobDocument>(
    {
      user_id: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      type: {
        type: String,
        required: true,
        enum: JOB_TYPES,
      },
      status: {
        type: String,
        required: true,
        enum: JOB_STATUSES,
        default: 'pending',
      },
      input: {
        type: Schema.Types.Mixed,
        required: true,
      },
      result: { type: Schema.Types.Mixed },
      error: { type: String },
      attempts: {
        type: Number,
        default: 0,
      },
      completed_on: { type: Date },
    },
    {
      timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on',
      },
    }
);

JobSchema.index({
  user_id: 1,
  type: 1,
  status: 1,
});
