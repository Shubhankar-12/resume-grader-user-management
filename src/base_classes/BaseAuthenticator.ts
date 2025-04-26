import {
  Request, Response, NextFunction,
} from 'express';
import express from 'express';
import { Responses } from '../helpers/Responses';
import { MiddleWareFunctionType } from '../helpers';
import { POLICIES } from '../common_middleware/policies';

export abstract class BaseAuthenticator extends Responses {
  /**
   * This is the implementation that we will leave to the
   * subclasses to figure out.
   */

  protected abstract executeImpl(
    req: express.Request,
    res: express.Response,
    policies: POLICIES[]
  ): Promise<void>;

  /**
   * This is what we will call on the route handler.
   * We also make sure to catch any uncaught errors in the
   * implementation.
   * Check out the usecase file in authentication for implementation
   */

  public authenticate(policies:POLICIES[]): MiddleWareFunctionType {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
      try {
        await this.executeImpl(req, res, policies);
      } catch (err) {
        console.log('[BaseAuthenticator]: Uncaught authenticator error', err);
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
