import { Document, Model } from "mongoose";

interface IResumeMatch {
  resume_id: string;
  job_description: string;
  keyRequirements: {
    requiredSkills: string[];
    experienceLevel: string;
    education: string;
    keyResponsibilities: string[];
  };
  resumeMatchAnalysis: {
    overallMatch: number;
    matchingSkills: string[];
    missingSkills: string[];
    experienceMatch: {
      isMatching: boolean;
      message: string;
    };
    educationMatch: {
      isMatching: boolean;
      message: string;
    };
    projectsMatch: {
      isMatching: boolean;
      message: string;
      relevantProjects: string[];
    };
    certificationMatch: {
      isMatching: boolean;
      message: string;
      relevantCertifications: string[];
      recommendedCertifications: string[];
    };
  };
  status: string;
}

interface IResumeMatchDocument extends IResumeMatch, Document {}

type IResumeMatchModel = Model<IResumeMatchDocument>;

export { IResumeMatch, IResumeMatchDocument, IResumeMatchModel };
