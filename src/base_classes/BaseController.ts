import {
  Request, Response, NextFunction,
} from 'express';
import express from 'express';
import { Responses } from '../helpers/Responses';
import { MiddleWareFunctionType } from '../helpers';

export abstract class BaseController extends Responses {
  /**
   * This is the implementation that we will leave to the
   * subclasses to figure out.
   */

  protected abstract executeImpl(
    req: express.Request,
    res: express.Response
  ): Promise<void>;

  /**
   * This is what we will call on the route handler.
   * We also make sure to catch any uncaught errors in the
   * implementation.
   */

  public execute(): MiddleWareFunctionType {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
      try {
        await this.executeImpl(req, res);
      } catch (err) {
        console.log('[BaseController]: Uncaught controller error', err);
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
