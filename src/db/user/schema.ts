import { Schema, Types, model } from "mongoose";

const ObjectId = Types.ObjectId;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    avatar: {
      name: { type: String },
      url: { type: String },
      mimetype: { type: String },
    },
    provider: {
      type: String,
      enum: ["google", "github"],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
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
