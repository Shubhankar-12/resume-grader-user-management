import { Document, Model } from "mongoose";

interface IUser {
  name: string;
  username?: string;
  email: string;
  avatar: {
    name?: string;
    url?: string;
    mimetype?: string;
  };
  provider: string;
  providerId: string;
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
  status: string;
}

interface IUserDocument extends IUser, Document {}

type IUserModel = Model<IUserDocument>;

export { IUser, IUserDocument, IUserModel };
