/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser, IUserDocument, IUserModel } from "../user/types";

export class UserQueries {
  private userModel: IUserModel;

  constructor(userModel: IUserModel) {
    this.userModel = userModel;
  }

  async create(user: IUser): Promise<IUserDocument> {
    return await this.userModel.create(user);
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
        _id: id,
        status: {
          $ne: "DISABLED",
        },
      },
    });

    const user = await this.userModel.aggregate(aggregateQuery);

    return user;
  }
}
