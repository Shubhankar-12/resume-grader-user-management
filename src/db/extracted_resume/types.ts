import { Document, Model } from "mongoose";

interface IExtractedResume {
  resume_id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: {
    companyName: string;
    role: string;
    tasks: string[];
    startDate: string;
    endDate: string;
    isPresent: boolean;
  }[];
  status: string;
}

interface IExtractedResumeDocument extends IExtractedResume, Document {}

type IExtractedResumeModel = Model<IExtractedResumeDocument>;

export { IExtractedResume, IExtractedResumeDocument, IExtractedResumeModel };
