import {
  NextFunction,
  Request, Response,
} from 'express';
import {
  AuthenticationError, MiddleWareFunctionType, Responses,
} from '../../helpers';
import { ResponseLocalAuth } from '../../interfaces';
import { logAuthenticationError } from '../../logger';


export class RequestLoggedInAuthenticator extends Responses {
  public execute(): MiddleWareFunctionType {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
      try {
        // check if the user is logged in
        const authObj:ResponseLocalAuth = res.locals.auth;
        if ( authObj.decoded_token.is_login == false) {
          // console.log('return due to is_login false token');
          res.locals.response =
        this.unauthorized(res, [new AuthenticationError('authorization'),
        ]);
          logAuthenticationError([new AuthenticationError('authorization'),
          ], { level: 'info' }, res);
          this.sendResponse(req, res);
          return;
        }
      } catch (err) {
        res.locals.response = this.fail(
            { message: 'An unexpected error occurred' });
        this.sendResponse(req, res);
      }
      if (!res.headersSent) {
        return next();
      }
    };
  }
}

export const requestLoggedInAuthenticator =
  new RequestLoggedInAuthenticator();
