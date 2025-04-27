import { Document, Model } from "mongoose";

interface IExtractedResume {
  resume_id: string;

  category: string;
  name: string;
  summary: string;
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
    location: string;
    description: string;
  }[];
  education: {
    schoolName: string;
    degree: string;
    subject: string;
    location: string;
    startDate: string;
    endDate: string;
  }[];

  status: string;
}

interface IExtractedResumeDocument extends IExtractedResume, Document {}

type IExtractedResumeModel = Model<IExtractedResumeDocument>;

export { IExtractedResume, IExtractedResumeDocument, IExtractedResumeModel };
