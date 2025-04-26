import { Schema, Types } from "mongoose";

const ObjectId = Types.ObjectId;

const LoginSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    is_login: {
      type: Boolean,
      required: true,
    },
    user: {
      type: {
        id: {
          type: ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        provider: {
          type: String,
          required: true,
        },
        providerId: {
          type: String,
          required: true,
        },
        username: {
          type: String,
        },
      },
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_on",
      updatedAt: "updated_on",
    },
  }
);

export { LoginSchema };
