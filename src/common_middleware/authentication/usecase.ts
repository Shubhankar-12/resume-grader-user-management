import { loginQueries } from '../../db';
import { TokenStatus } from '../../helpers';
import { AuthenticationError } from '../../helpers/GeneralErrors';
import {
  UseCase, ResponseLocalAuth, errClass, successClass, Either,
} from '../../interfaces';

type AuthenticationResponse = Either< AuthenticationError, boolean >;

/**
 * Checks if the sent token is present in the database
 * Checks if the token is expired
 */
export class AuthenticateUseCase implements
  UseCase<ResponseLocalAuth, AuthenticationResponse> {
  async execute(
      auth: ResponseLocalAuth):Promise<AuthenticationResponse> {
    const present_token_state = await loginQueries.findLogin(
        { token: auth.token });

    // CASE: Token sent by the user doesn't exists in the database
    if (present_token_state.length == 0) {
      global.dbLogger.log({
        level: 'warn',
        category: 'warn',
        data: `The token ${auth.token} does not exists in the database
           but was queried for`,
      });
      // console.log('return due to missing token');
      return errClass(new AuthenticationError('Authorization'));
    } else if (
    // CASE: Token is expired
      present_token_state[0].status == TokenStatus.EXPIRED) {
      // console.log('return due to expired token');
      return errClass(new AuthenticationError('Authorization'));
    }
    return successClass(true);
  }
}

export const authenticateUseCase = new AuthenticateUseCase();
