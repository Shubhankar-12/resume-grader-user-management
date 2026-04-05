import { Schema } from 'mongoose';
import { APPLICATION_STATUSES } from './types';

const ApplicationSchema = new Schema(
    {
      user_id: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      job_url: {
        type: String,
        required: true,
        default: '',
      },
      job_description: {
        type: String,
        required: true,
        default: '',
      },
      status: {
        type: String,
        enum: APPLICATION_STATUSES,
        required: true,
        default: 'BOOKMARKED',
      },
      position: {
        type: Number,
        required: true,
        default: 0,
      },
      notes: {
        type: String,
        required: true,
        default: '',
      },
      applied_date: {
        type: Date,
        default: null,
      },
      resume_id: {
        type: String,
        default: null,
      },
      cover_letter_id: {
        type: String,
        default: null,
      },
      status_field: {
        type: String,
        enum: ['ENABLED', 'DISABLED'],
        required: true,
        default: 'ENABLED',
      },
    },
    {
      timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on',
      },
    }
);

ApplicationSchema.index({ user_id: 1, status_field: 1 });
ApplicationSchema.index({ user_id: 1, status: 1, position: 1 });

export { ApplicationSchema };
