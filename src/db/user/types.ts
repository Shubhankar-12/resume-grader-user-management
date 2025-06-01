import { Document, Model } from "mongoose";

interface IUser {
  name: string;
  username?: string;
  password?: string;
  email: string;
  razorpay_customer_id?: string;
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
  status: string;
}

interface IUserDocument extends IUser, Document {}

type IUserModel = Model<IUserDocument>;

export { IUser, IUserDocument, IUserModel };
