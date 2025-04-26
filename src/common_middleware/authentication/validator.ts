/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AuthenticationError } from '../../helpers';
import {
  errClass, successClass,
} from '../../interfaces';
import { logUnexpectedValidatorError } from '../../logger';
import {
  Either, GeneralError,
} from '../../interfaces';
import { POLICIES } from '../policies';
import { TokenUtils } from '../../helpers/utils';
type Response = Either<GeneralError, boolean>;

export class AuthenticationValidator {
  @logUnexpectedValidatorError({ level: 'error' })
  validateAuthorization(value: any, policies: POLICIES[]): Response {
    const field = 'Authorization';
    if (value == undefined) {
      return errClass(new AuthenticationError(field));
    } else if (typeof value != 'string') {
      return errClass(new AuthenticationError(field));
    } else if (value.length == 0) {
      return errClass(new AuthenticationError(field));
    } else {
      // expect auth like Bearer token
      const bits = value.split(' ');
      if (bits.length != 2) {
        return errClass(new AuthenticationError(field));
      } else {
        let verified = false;
        for ( let i=0; i<policies.length; i++) {
          // console.log(policies[i], TokenUtils.verifyToken(bits[1], policies[i]));
          if (TokenUtils.verifyToken(bits[1], policies[i])) {
            verified = true;
          }
        }
        if (!verified) {
          return errClass(new AuthenticationError(field));
        } else {
          return successClass(true);
        }
      }
    }
  }
}

export const authenticationValidator = new AuthenticationValidator();
