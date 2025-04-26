import { Request, Response, NextFunction } from "express";
import { MiddleWareFunctionType, Responses } from "../../../helpers";
import { CreateUserResumeParser } from "./parser";
import { userResumeValidator } from "../UserResumeValidator";
import { logValidationError } from "../../../logger";

export class CreateUserResumeRequestValidator extends Responses {
  constructor() {
    super();
  }

  public validate(): MiddleWareFunctionType {
    return async (req: Request, res: Response, next: NextFunction) => {
      const parser = new CreateUserResumeParser(req.body, userResumeValidator);
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

const createUserResumeValidator = new CreateUserResumeRequestValidator();
export { createUserResumeValidator };
