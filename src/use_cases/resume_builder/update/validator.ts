// src/use_cases/resume_builder/update/validator.ts
import { Request, Response, NextFunction } from 'express';
import { MiddleWareFunctionType, Responses } from '../../../helpers';
import { UpdateResumeDraftParser } from './parser';
import { userResumeValidator } from '../../user_resume/UserResumeValidator';
import { logValidationError } from '../../../logger';
export class UpdateResumeDraftRequestValidator extends Responses {
  public validate(): MiddleWareFunctionType {
    return async (req: Request, res: Response, next: NextFunction) => {
      const parser = new UpdateResumeDraftParser(req.body, userResumeValidator);
      const errors = parser.getErrors();
      if (errors.length === 0) return next();
      res.locals.response = this.fail({ errors, message: 'Invalid Request', statusCode: 400 });
      logValidationError(errors, { level: 'info' }, res);
      return this.sendResponse(req, res);
    };
  }
}
const updateResumeDraftValidator = new UpdateResumeDraftRequestValidator();
export { updateResumeDraftValidator };
