/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from "mongodb";
import { IUser, IUserDocument, IUserModel } from "../user/types";

export class UserQueries {
  private userModel: IUserModel;

  constructor(userModel: IUserModel) {
    this.userModel = userModel;
  }

  async create(user: IUser): Promise<IUserDocument> {
    return await this.userModel.create(user);
  }

  async updateUser(data: any): Promise<any> {
    const filter = { _id: data.user_id };
    return await this.userModel.updateOne(filter, {
      $set: data,
    });
  }

  async getUserByGithubLogin(github_login: string): Promise<any> {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        username: github_login,
        status: {
          $ne: "DISABLED",
        },
      },
    });

    const user = await this.userModel.aggregate(aggregateQuery);

    return user;
  }

  async getUserById(id: string): Promise<any> {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        _id: new ObjectId(id),
        status: {
          $ne: "DISABLED",
        },
      },
    });

    const user = await this.userModel.aggregate(aggregateQuery);

    return user;
  }
  async getUserByEmail(data: any): Promise<any> {
    let aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        email: data.email,

        status: {
          $ne: "DISABLED",
        },
      },
    });
    if (data.password) {
      aggregateQuery.push({
        $match: {
          password: data.password,
        },
      });
    }

    const user = await this.userModel.aggregate(aggregateQuery);

    return user;
  }
}
