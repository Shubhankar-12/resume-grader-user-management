import { model } from "mongoose";
import { IJobDocument } from "./types";
import { JobSchema } from "./schema";

export const jobModel = model<IJobDocument>("job", JobSchema, "jobs");
