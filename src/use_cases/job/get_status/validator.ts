import {
  Request, Response, NextFunction,
} from 'express';
import {
  MiddleWareFunctionType, Responses,
} from '../../../helpers';
import { GetJobStatusParser } from './parser';
import { jobValidator } from '../JobValidator';
import { logValidationError } from '../../../logger';

export class GetJobStatusRequestValidator extends Responses {
  constructor() {
    super();
  }

  public validate(): MiddleWareFunctionType {
    return async (req: Request, res: Response, next: NextFunction) => {
      const parser = new GetJobStatusParser(req.query, jobValidator);
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

const getJobStatusValidator = new GetJobStatusRequestValidator();
export { getJobStatusValidator };
