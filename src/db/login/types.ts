import { Document, Model } from "mongoose";

interface ILogin {
  token: string;
  is_login: boolean;
  user: {
    id: string;
    name: string;
    provider: string;
    providerId: string;
    username?: string;
  } | null;
  status: string;
}

interface ILoginDocument extends ILogin, Document {}

type ILoginModel = Model<ILoginDocument>;

export { ILogin, ILoginDocument, ILoginModel };
