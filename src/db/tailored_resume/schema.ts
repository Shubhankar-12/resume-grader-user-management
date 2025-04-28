import { Schema, Types, model } from "mongoose";

const ObjectId = Types.ObjectId;

const TailoredResumeSchema = new Schema(
  {
    resume_id: {
      type: ObjectId,
      required: true,
    },
    name: {
      type: String,
    },
    category: {
      type: String,
    },
    summary: {
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
        location: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
    education: [
      {
        schoolName: {
          type: String,
        },
        degree: {
          type: String,
        },
        subject: {
          type: String,
        },
        location: {
          type: String,
        },
        startDate: {
          type: String,
        },
        endDate: {
          type: String,
        },
      },
    ],
    projects: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        technologies: {
          type: [String],
        },
        startDate: {
          type: String,
        },
        endDate: {
          type: String,
        },
        links: [
          {
            Github: {
              type: String,
            },
            Website: {
              type: String,
            },
          },
        ],
      },
    ],
    achievements: {
      type: [String],
    },
    certifications: {
      type: [String],
    },
    languages: {
      type: [String],
    },
    intrests: {
      type: [String],
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

export { TailoredResumeSchema };
