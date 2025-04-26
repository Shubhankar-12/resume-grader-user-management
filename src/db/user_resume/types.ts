import { Document, Model } from "mongoose";

interface IUserResume {
  user_id: string;
  resume: {
    name: string;
    url: string;
    mimetype: string;
  };
  extractedText: string;
  analysis: {
    gradingScore: number;
    atsScore: number;
    suggestions: string[];
  };

  status: string;
}

interface IUserResumeDocument extends IUserResume, Document {}

type IUserResumeModel = Model<IUserResumeDocument>;

export { IUserResume, IUserResumeDocument, IUserResumeModel };
