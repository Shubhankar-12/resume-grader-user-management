import { Schema, Types, model } from "mongoose";

const ObjectId = Types.ObjectId;

const UserResumeSchema = new Schema(
  {
    user_id: {
      type: ObjectId,
      required: true,
    },
    resume: {
      name: { type: String },
      url: { type: String },
      mimetype: { type: String },
    },
    extractedText: {
      type: String,
    },
    analysis: {
      gradingScore: { type: Number },
      atsScore: { type: Number },
      suggestions: [
        {
          title: { type: String },
          description: { type: String },
        },
      ],
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

export { UserResumeSchema };
