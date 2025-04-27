import { Document, Model } from "mongoose";

interface ITailoredResume {
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

interface ITailoredResumeDocument extends ITailoredResume, Document {}

type ITailoredResumeModel = Model<ITailoredResumeDocument>;

export { ITailoredResume, ITailoredResumeDocument, ITailoredResumeModel };
