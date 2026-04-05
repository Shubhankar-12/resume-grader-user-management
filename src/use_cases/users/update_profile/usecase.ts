import { userQueries } from '../../../db/queries';
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
  ResponseLocalAuth,
} from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { IUpdateProfileDto } from './dto';
import { UserNotFoundError, ProfileUpdateFailedError } from './errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = Either<UseCaseError, any>;

type Request = {
  request: IUpdateProfileDto;
  auth: ResponseLocalAuth;
};

export class UpdateProfileUseCase implements UseCase<Request, Response> {
  @logUnexpectedUsecaseError({ level: 'error' })
  async execute({ request, auth }: Request): Promise<Response> {
    const userId = auth?.decoded_token?.user?.id;

    if (!userId) {
      return errClass(new UserNotFoundError('unknown', 'user_id'));
    }

    try {
      const existing = await userQueries.getUserById(userId);
      if (!existing || existing.length === 0) {
        return errClass(new UserNotFoundError(userId, 'user_id'));
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};
      if (request.career_goal !== undefined) updateData.career_goal = request.career_goal;
      if (request.target_role !== undefined) updateData.target_role = request.target_role;
      if (request.onboarding_completed !== undefined) updateData.onboarding_completed = request.onboarding_completed;
      if (request.name !== undefined) updateData.name = request.name;

      await userQueries.updateProfile(userId, updateData);
      return successClass({ success: true });
    } catch (error) {
      console.error('Unexpected error in UpdateProfileUseCase:', error);
      return errClass(new ProfileUpdateFailedError());
    }
  }
}
