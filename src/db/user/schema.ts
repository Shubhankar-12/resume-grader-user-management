import { Schema, Types, model } from "mongoose";

const ObjectId = Types.ObjectId;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },

    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    razorpay_customer_id: {
      type: String,
    },
    avatar: {
      name: { type: String },
      url: { type: String },
      mimetype: { type: String },
    },
    provider: {
      type: String,
      enum: ["google", "github"],
    },
    providerId: {
      type: String,
    },
    githubProfile: {
      githubId: { type: String },
      username: { type: String },
      profileUrl: { type: String },
      reposUrl: { type: String },
    },
    googleProfile: {
      googleId: { type: String },
      locale: { type: String },
    },
    usage: {
      resumeUploads: { type: Number, default: 0 },
      tailoredResumes: { type: Number, default: 0 },
      coverLetters: { type: Number, default: 0 },
      githubAnalyses: { type: Number, default: 0 },
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

export { UserSchema };
