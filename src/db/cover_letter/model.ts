import { model } from "mongoose";
import { CoverLetterSchema } from "./schema";
import { ICoverLetterDocument } from "./types";

const coverLetterModel = model<ICoverLetterDocument>(
  "cover_letter",
  CoverLetterSchema,
  "cover_letters"
);

export { coverLetterModel };
