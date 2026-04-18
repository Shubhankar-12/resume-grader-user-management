import {
  Document, Model,
} from 'mongoose';

interface IUser {
  name: string;
  username?: string;
  password?: string;
  email: string;
  razorpay_customer_id?: string;
  region?: 'IN' | 'GLOBAL' | null;
  currency?: 'INR' | 'USD' | null;
  stripe_customer_id?: string | null;
  credit_balance?: number;
  avatar?: {
    name?: string;
    url?: string;
    mimetype?: string;
  };
  provider?: string;
  providerId?: string;
  githubProfile?: {
    id: string;
    username: string;
    profileUrl: string;
    reposUrl: string;
  };
  googleProfile?: {
    id: string;
    locale: string;
  };
  usage?: {
    resumeUploads: number;
    tailoredResumes: number;
    coverLetters: number;
    githubAnalyses: number;
  };
  career_goal?: 'NEW_JOB' | 'CAREER_CHANGE' | 'FIRST_JOB' | 'FREELANCING' | null;
  target_role?: string | null;
  onboarding_completed?: boolean;
  status: string;
}

interface IUserDocument extends IUser, Document {}

type IUserModel = Model<IUserDocument>;

export {
  IUser, IUserDocument, IUserModel,
};
