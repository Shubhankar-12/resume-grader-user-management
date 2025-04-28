import { Schema, Types, model } from "mongoose";

const ObjectId = Types.ObjectId;

const ResumeMatchSchema = new Schema(
  {
    resume_id: {
      type: ObjectId,
      required: true,
    },
    job_description: {
      type: String,
      required: true,
    },

    keyRequirements: {
      requiredSkills: {
        type: [String],
        default: [],
      },
      experienceLevel: {
        type: String,
        default: "",
      },
      education: {
        type: String,
        default: "",
      },
      keyResponsibilities: {
        type: [String],
        default: [],
      },
    },

    resumeMatchAnalysis: {
      overallMatch: {
        type: Number, // percentage match
        default: 0,
      },
      matchingSkills: {
        type: [String],
        default: [],
      },
      missingSkills: {
        type: [String],
        default: [],
      },
      experienceMatch: {
        isMatching: {
          type: Boolean,
          default: false,
        },
        message: {
          type: String,
          default: "",
        },
      },
      educationMatch: {
        isMatching: {
          type: Boolean,
          default: false,
        },
        message: {
          type: String,
          default: "",
        },
      },
      projectsMatch: {
        isMatching: {
          type: Boolean,
          default: false,
        },
        message: {
          type: String,
          default: "",
        },
        relevantProjects: {
          type: [String],
          default: [],
        },
      },
      certificationMatch: {
        isMatching: {
          type: Boolean,
          default: false,
        },
        message: {
          type: String,
          default: "",
        },
        relevantCertifications: {
          type: [String],
          default: [],
        },
        recommendedCertifications: {
          type: [String],
          default: [],
        },
      },
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

export { ResumeMatchSchema };
