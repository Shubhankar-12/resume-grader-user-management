/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILogin, ILoginDocument, ILoginModel } from "../login/types";
import { Types } from "mongoose";
import { ModificationResponse, TokenDevice } from "../../interfaces";
import { TokenStatus } from "../../helpers";
import { ObjectId } from "mongodb";

export class LoginQueries {
  private loginModel: ILoginModel;

  constructor(loginModel: ILoginModel) {
    this.loginModel = loginModel;
  }

  async createLogin(login: ILogin): Promise<ILoginDocument> {
    return await this.loginModel.create(login);
  }

  async updateLogins(match: any, update_content: any): Promise<any> {
    return await this.loginModel.updateMany(match, { $set: update_content });
  }

  async findLogin(query: any): Promise<ILoginDocument[]> {
    return await this.loginModel.find(query).sort({ updated_on: -1 });
  }
  // async findLoginByUserId(user_id: string): Promise<ILoginDocument[]> {
  //   return await this.loginModel.find({
  //     "user.id": new ObjectId(user_id),
  //     status: "ENABLED",
  //   });
  // }

  async findLoginByUserId(
    employee_id: string | Types.ObjectId
  ): Promise<ILoginDocument[]> {
    return await this.loginModel
      .find({ "user.id": employee_id, status: "ENABLED" })
      .sort({ updated_on: -1 });
  }
  async getGuestToken(device: TokenDevice): Promise<string | null> {
    const result = await this.loginModel.find({
      is_login: false,
      device,
    });
    if (result.length > 0) {
      return result[0].token;
    } else {
      return null;
    }
  }

  async expireToken(token: string): Promise<any> {
    const result = await this.loginModel.updateOne(
      { token },
      { status: TokenStatus.EXPIRED }
    );
    return result;
  }
}
