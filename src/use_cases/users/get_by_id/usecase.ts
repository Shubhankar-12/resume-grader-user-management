import {
  UseCase,
  Either,
  successClass,
  ResponseLocalAuth,
  UseCaseError,
  errClass,
} from "../../../interfaces";
import { IGetUserDto } from "./dto";
import { logUnexpectedUsecaseError } from "../../../logger";
import { userQueries } from "../../../db/queries";
import { UserNotFoundError } from "./error";

type Response = Either<UseCaseError, any>;
type Request = {
  request: IGetUserDto;
  auth: ResponseLocalAuth;
};

export class GetUserByIdUseCase implements UseCase<Request, Response> {
  @logUnexpectedUsecaseError({ level: "error" })
  async execute({ request, auth }: Request): Promise<Response> {
    const User = await userQueries.getUserById(request.user_id);
    if (User.length == 0) {
      return errClass(new UserNotFoundError("user_id"));
    }
    return successClass(User[0]);
  }
}
