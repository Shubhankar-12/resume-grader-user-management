import {
  UseCase,
  Either,
  successClass,
  ResponseLocalAuth,
  UseCaseError,
  errClass,
} from "../../../interfaces";
import { IGetDashboardStatsDto } from "./dto";
import { logUnexpectedUsecaseError } from "../../../logger";
import { userQueries } from "../../../db/queries";
import { UserNotFoundError } from "./error";

type Response = Either<UseCaseError, any>;
type Request = {
  request: IGetDashboardStatsDto;
  auth: ResponseLocalAuth;
};

export class GetDashboardStatsByIdUseCase
  implements UseCase<Request, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute({ request, auth }: Request): Promise<Response> {
    const token = auth.token;
    const userId = auth?.decoded_token?.user?.id;

    if (!token || !userId) {
      return errClass(new UserNotFoundError("user_id"));
    }

    const User = await userQueries.getDashboardStats(userId);
    if (User.length == 0) {
      return errClass(new UserNotFoundError("user_id"));
    }
    return successClass(User[0]);
  }
}
