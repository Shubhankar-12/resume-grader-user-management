import { Schema, Types, model } from "mongoose";

const ObjectId = Types.ObjectId;

const ProjectAnalysisSchema = new Schema(
  {
    user_id: {
      type: ObjectId,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },
    project_ids: {
      type: [Number],
      required: true,
    },

    selected_project: [
      {
        id: { type: Number },
        name: { type: String },
        description: { type: String },
        stars: { type: Number },
        language: { type: String },
        languageColor: { type: String },
        topics: [{ type: String }],
        ai_score: { type: Number }, // Score from 0–100
        relevance: { type: String }, // e.g. HIGH, MEDIUM, LOW
        reason: { type: String },
        additional_comments: { type: String },
        key_points: [{ type: String }],
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

export { ProjectAnalysisSchema };
