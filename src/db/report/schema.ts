import { Schema, Types, model } from "mongoose";

const ObjectId = Types.ObjectId;

const ReportSchema = new Schema(
  {
    resume_id: {
      type: ObjectId,
      required: true,
    },
    overallGrade: {
      type: String,
      required: true,
    },
    scoreOutOf100: {
      type: Number,
      required: true,
    },
    scoreBreakdown: {
      atsCompatibility: {
        type: Number,
        required: true,
      },
      keywordMatch: {
        type: Number,
        required: true,
      },
      contentQuality: {
        type: Number,
        required: true,
      },
      formatting: {
        type: Number,
        required: true,
      },
    },
    strengths: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    areasForImprovement: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    keywordAnalysis: {
      presentKeywords: [
        {
          type: String,
        },
      ],
      missingKeywords: [
        {
          type: String,
        },
      ],
    },
    actionableSuggestions: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        block: { type: String, required: true }, // store HTML block as string
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

export { ReportSchema };
