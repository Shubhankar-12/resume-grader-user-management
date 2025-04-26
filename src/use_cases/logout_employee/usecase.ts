import jsonwebtoken from 'jsonwebtoken';
import {
  UseCase, Either, errClass, successClass, ResponseLocalAuth, Token,
} from '../../interfaces';
import { loginQueries } from '../../db';
import { logUnexpectedUsecaseError } from '../../logger';
import { AuthenticationError } from '../../helpers/GeneralErrors';

type Response = Either<AuthenticationError,
  { token: string }>;


export class LogoutUserUseCase
implements UseCase<ResponseLocalAuth, Response> {
  @logUnexpectedUsecaseError({ level: 'error' })
  async execute(auth: ResponseLocalAuth): Promise<Response> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loginObj: Token = jsonwebtoken.decode(auth.token) as unknown as Token;

    if (!loginObj.is_login) { // if token is not logged in
      // send back auth error
      return errClass(new AuthenticationError('Authorization'));
    } else { // if logged in
      await loginQueries.expireToken(auth.token);
      // getting the guest token
      const token = await loginQueries.getGuestToken(loginObj.device);
      // send back same guest token
      return successClass({ token: token! });
    }
  }
}
