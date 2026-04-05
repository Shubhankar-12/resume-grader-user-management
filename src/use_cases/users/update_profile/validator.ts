import {
  Request, Response, NextFunction,
} from 'express';
import {
  MiddleWareFunctionType, Responses,
} from '../../../helpers';
import { UpdateProfileParser } from './parser';
import { userValidator } from '../UserValidator';
import { logValidationError } from '../../../logger';

export class UpdateProfileRequestValidator extends Responses {
  constructor() {
    super();
  }

  public validate(): MiddleWareFunctionType {
    return async (req: Request, res: Response, next: NextFunction) => {
      const parser = new UpdateProfileParser(req.body, userValidator);
      const errors = parser.getErrors();
      if (errors.length == 0) return next();
      else {
        res.locals.response = this.fail({
          errors,
          message: 'Invalid Request',
          statusCode: 400,
        });
        logValidationError(errors, { level: 'info' }, res);
        return this.sendResponse(req, res);
      }
    };
  }
}

const updateProfileValidator = new UpdateProfileRequestValidator();
export { updateProfileValidator };
