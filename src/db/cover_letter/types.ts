import { Document, Model } from "mongoose";

interface ICoverLetter {
  user_id: string;
  resume_id: string;
  role: string;
  company: string;
  job_description: string;
  cover_letter: string;
  cover_letter_summary: string;
  status: string;
}

interface ICoverLetterDocument extends ICoverLetter, Document {}

type ICoverLetterModel = Model<ICoverLetterDocument>;

export { ICoverLetter, ICoverLetterDocument, ICoverLetterModel };
