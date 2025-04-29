import { Document, Model } from "mongoose";

interface ITailoredResume {
  resume_id: string;
  user_id: string;
  atsScore: number;
  job_description: string;
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
  projects: [
    {
      title: string;
      description: string;
      technologies: [string];
      startDate: string;
      endDate: string;
      links: {
        GitHub: string;
        Website: string;
      };
    }
  ];
  achievements: [string];
  certifications: [string];
  languages: [string];
  interests: [string];
  status: string;
}

interface ITailoredResumeDocument extends ITailoredResume, Document {}

type ITailoredResumeModel = Model<ITailoredResumeDocument>;

export { ITailoredResume, ITailoredResumeDocument, ITailoredResumeModel };
