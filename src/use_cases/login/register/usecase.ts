import {
  UseCase,
  Either,
  errClass,
  successClass,
  ResponseLocalAuth,
  Token,
  UseCaseError,
} from "../../../interfaces";
import { loginQueries, userQueries } from "../../../db";
import { UserAlreadyExists, RoleDosentExists } from "./errors";
import { IRegisterOwnerDto } from "./dto";
import { logUnexpectedUsecaseError } from "../../../logger";
import { BUCKET_URL_HTTPS, TokenStatus } from "../../../helpers";
import { createToken } from "../../common/CreateToken";

type Response = Either<UseCaseError, { token: string }>;

type UseCaseRequest = { request: IRegisterOwnerDto; auth: ResponseLocalAuth };

export class RegisterUserWithEmailUseCase
  implements UseCase<IRegisterOwnerDto, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: IRegisterOwnerDto): Promise<Response> {
    const users = await userQueries.getUserByEmail({ email: request.email });
    if (users.length > 0) {
      // if no user found, resend the error, invalid email or password
      return errClass(new UserAlreadyExists());
    }
    const userResult = await userQueries.create({
      ...request,
      status: "ENABLED",
    });
    console.log("userResult", userResult);

    const loginObj = await loginQueries.findLoginByUserId(userResult._id);

    if (loginObj.length > 0) {
      return successClass({ token: loginObj[0].token });
    }

    const login_document: Token = {
      is_login: true,
      user: {
        id: userResult._id,
        name: userResult.name,
        username: "",
        provider: "",
        providerId: "",
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
