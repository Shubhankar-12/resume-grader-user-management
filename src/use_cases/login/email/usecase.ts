import {
  UseCase,
  Either,
  errClass,
  successClass,
  ResponseLocalAuth,
  Token,
  UseCaseError,
} from "../../../interfaces";
import { loginQueries, ILogin, userQueries } from "../../../db";
import { InvalidEmailOrPassword, RoleDosentExists } from "./errors";
import { ILoginOwnerDto } from "./dto";
import { logUnexpectedUsecaseError } from "../../../logger";
import { BUCKET_URL_HTTPS, TokenStatus } from "../../../helpers";
import { createToken } from "../../common/CreateToken";

type Response = Either<UseCaseError, { token: string }>;

type UseCaseRequest = { request: ILoginOwnerDto; auth: ResponseLocalAuth };

export class LoginUserWithEmailUseCase
  implements UseCase<ILoginOwnerDto, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: ILoginOwnerDto): Promise<Response> {
    // if not logged in
    // query the database for the given email and password
    console.log(request);
    const users = await userQueries.getUserByEmail(request);
    if (users.length == 0) {
      // if no user found, resend the error, invalid email or password
      return errClass(new InvalidEmailOrPassword());
    }
    const userResult = await userQueries.getUserById(users[0]._id);

    const loginObj = await loginQueries.findLoginByUserId(userResult[0]._id);

    if (loginObj.length > 0) {
      return successClass({ token: loginObj[0].token });
    }

    const login_document: Token = {
      is_login: true,
      user: {
        id: users[0]._id,
        name: users[0].name,
        username: users[0].username,
        provider: users[0].provider,
        providerId: users[0].providerId,
      },
    };

    const token = await createToken(login_document);

    // saving the new login token
    await loginQueries.createLogin({
      ...login_document,
      token,
      status: "ENABLED",
    });

    // send back the new token
    return successClass({ token: token });
  }
}
