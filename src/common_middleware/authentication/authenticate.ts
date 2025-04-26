import {
  Request, Response,
} from 'express';
import { BaseAuthenticator } from '../../base_classes/BaseAuthenticator';
import { RequestHeaders } from '../../interfaces';
import { logAuthenticationError } from '../../logger';
import { AuthenticationParser } from './parser';
import { AuthDtoConverter } from './dto';
import { authenticateUseCase } from './usecase';
import { authenticationValidator } from './validator';
import { POLICIES } from '../policies';


export class RequestAuthenticator extends BaseAuthenticator {
  constructor() {
    super();
  }

  public async executeImpl(req: Request, res: Response, policies: POLICIES[]): Promise<void> {
    const parser = new AuthenticationParser(
        req.headers, authenticationValidator, policies);
    const errors = parser.getErrors();
    if (errors.length > 0) {
      res.locals.response = this.unauthorized(res, errors);
      logAuthenticationError(errors, { level: 'info' }, res);
      this.sendResponse(req, res);
    } else {
      const dtoHeadersObj = new AuthDtoConverter(
        req.headers as unknown as RequestHeaders);

      // =========================================
      // This is where the authentication details are stored in response object.
      // storing decoded token in locals.
      res.locals.auth = dtoHeadersObj.getDtoObject();
      // =========================================

      const result =
        await authenticateUseCase.execute(dtoHeadersObj.getDtoObject());
      if (result.isErrClass()) {
        res.locals.response = this.unauthorized(res, [result.value]);
        logAuthenticationError(errors, { level: 'info' }, res);
        this.sendResponse(req, res);
      }
    }
    return;
  }
}

export const requestAuthenticator =
  new RequestAuthenticator();
