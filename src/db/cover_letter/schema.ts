import { Schema, Types, model } from "mongoose";

const ObjectId = Types.ObjectId;

const CoverLetterSchema = new Schema(
  {
    user_id: {
      type: ObjectId,
      required: true,
    },
    resume_id: {
      type: ObjectId,
      required: true,
    },
    job_description: {
      type: String,
      required: true,
    },
    cover_letter: {
      type: String,
      required: true,
    },
    cover_letter_summary: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ENABLED", "DISABLED"],
      required: true,
      default: "ENABLED",
    },
  },
  {
    timestamps: {
      createdAt: "created_on",
      updatedAt: "updated_on",
    },
  }
);

export { CoverLetterSchema };
