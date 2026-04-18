/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongodb';
import {
  IUser, IUserDocument, IUserModel,
} from '../user/types';

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
    return await this.userModel.updateOne(filter, { $set: data });
  }

  async getUserByGithubLogin(github_login: string): Promise<any> {
    const aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        username: github_login,
        status: { $ne: 'DISABLED' },
      },
    });

    const user = await this.userModel.aggregate(aggregateQuery);

    return user;
  }

  async getUserById(id: string): Promise<any> {
    const aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        _id: new ObjectId(id),
        status: { $ne: 'DISABLED' },
      },
    });

    const user = await this.userModel.aggregate(aggregateQuery);

    return user;
  }
  async getUserByEmail(data: any): Promise<any> {
    const aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        email: data.email,

        status: { $ne: 'DISABLED' },
      },
    });
    if (data.password) {
      aggregateQuery.push({ $match: { password: data.password } });
    }

    const user = await this.userModel.aggregate(aggregateQuery);

    return user;
  }

  async getDashboardStats(user_id: string): Promise<any> {
    const aggregateQuery: any[] = [];

    aggregateQuery.push({
      $match: {
        _id: new ObjectId(user_id),
        status: { $ne: 'DISABLED' },
      },
    });

    aggregateQuery.push({
      $lookup: {
        from: 'user_resumes',
        localField: '_id',
        foreignField: 'user_id',
        as: 'user_resumes',
        pipeline: [
          { $match: { status: { $ne: 'DISABLED' } } },
          { $sort: { created_on: -1 } },
          {
            $project: {
              _id: 0,
              user_resume_id: '$_id',
              analysis: 1,
              resume: 1,
              status: 1,
              created_on: 1,
              updated_on: 1,
            },
          },
        ],
      },
    });

    aggregateQuery.push({
      $unwind: {
        path: '$user_resumes',
        preserveNullAndEmptyArrays: true,
      },
    });

    aggregateQuery.push({
      $lookup: {
        from: 'cover_letters',
        localField: '_id',
        foreignField: 'user_id',
        as: 'cover_letters',
        pipeline: [
          { $match: { status: { $ne: 'DISABLED' } } },
          { $sort: { created_on: -1 } },
          {
            $project: {
              _id: 0,
              cover_letter_id: '$_id',
              resume_id: 1,
              user_id: 1,
              role: 1,
              company: 1,
              job_description: 1,
              created_on: 1,
              updated_on: 1,
            },
          },
        ],
      },
    });

    aggregateQuery.push({
      $unwind: {
        path: '$cover_letters',
        preserveNullAndEmptyArrays: true,
      },
    });

    aggregateQuery.push({
      $project: {
        _id: 0,
        user_id: '$_id',
        user_resumes: 1,
        cover_letters: 1,
        name: 1,
        avatar: 1,
        provider: 1,
        githubProfile: 1,
        user_resume: {
          // if user_resume is null, then return empty object else return user_resume[0]
          $cond: {
            if: { $eq: ['$user_resumes', []] },
            then: {},
            else: '$user_resumes[0]',
          },
        },
        cover_letter: {
          // if cover_letter is null, then return empty object else return cover_letter[0]
          $cond: {
            if: { $eq: ['$cover_letters', []] },
            then: {},
            else: '$cover_letters[0]',
          },
        },
      },
    });

    const user = await this.userModel.aggregate(aggregateQuery);
    // console.log("user", user);

    return user;
  }

  async updateProfile(userId: string, data: any): Promise<any> {
    const filter = { _id: new ObjectId(userId), status: { $ne: 'DISABLED' } };
    const allowedFields = ['career_goal', 'target_role', 'onboarding_completed', 'name', 'username'];
    const updateData: any = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }
    return await this.userModel.updateOne(filter, { $set: updateData });
  }

  async incrementCreditBalance(userId: string, delta: number): Promise<void> {
    await this.userModel.updateOne(
        { _id: userId },
        { $inc: { credit_balance: delta } },
    );
  }

  async tryDeductCreditBalance(userId: string, cost: number): Promise<boolean> {
    const result = await this.userModel.findOneAndUpdate(
        { _id: userId, credit_balance: { $gte: cost } },
        { $inc: { credit_balance: -cost } },
        { new: true },
    );
    return result != null;
  }

  async setCreditBalance(userId: string, value: number): Promise<void> {
    await this.userModel.updateOne(
        { _id: userId },
        { $set: { credit_balance: value } },
    );
  }

  async listAllUserIds(): Promise<string[]> {
    const users = await this.userModel.find({}, { _id: 1 }).lean();
    return users.map((u: any) => String(u._id));
  }
}
