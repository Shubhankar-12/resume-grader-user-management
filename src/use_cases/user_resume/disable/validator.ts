import { Request, Response, NextFunction } from "express";
import { MiddleWareFunctionType, Responses } from "../../../helpers";
import { DisableUserResumeParser } from "./parser";
import { userResumeValidator } from "../UserResumeValidator";
import { logValidationError } from "../../../logger";

export class DisableUserResumeRequestValidator extends Responses {
  constructor() {
    super();
  }

  public validate(): MiddleWareFunctionType {
    return async (req: Request, res: Response, next: NextFunction) => {
      const parser = new DisableUserResumeParser(req.body, userResumeValidator);
      const errors = parser.getErrors();
      if (errors.length == 0) return next();
      else {
        res.locals.response = this.fail({
          errors,
          message: "Invalid Request",
          statusCode: 400,
        });
        logValidationError(errors, { level: "info" }, res);
        return this.sendResponse(req, res);
      }
    };
  }
}

const disableUserResumeValidator = new DisableUserResumeRequestValidator();
export { disableUserResumeValidator };
