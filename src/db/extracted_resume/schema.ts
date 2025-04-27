import { Schema, Types, model } from "mongoose";

const ObjectId = Types.ObjectId;

const ExtractedResumeSchema = new Schema(
  {
    resume_id: {
      type: ObjectId,
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    skills: {
      type: [String],
    },
    experience: [
      {
        companyName: {
          type: String,
        },
        role: {
          type: String,
        },
        tasks: {
          type: [String],
        },
        startDate: {
          type: String,
        },
        endDate: {
          type: String,
        },
        isPresent: {
          type: Boolean,
        },
      },
    ],
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

export { ExtractedResumeSchema };
