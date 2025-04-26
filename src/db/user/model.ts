import { model } from "mongoose";
import { UserSchema } from "./schema";
import { IUserDocument } from "./types";

const userModel = model<IUserDocument>("user", UserSchema, "user");

export { userModel };
