import { Request, Response, NextFunction } from "express";
import { MiddleWareFunctionType, Responses } from "../../../helpers";
import { CreateCoverLetterParser } from "./parser";
import { userResumeValidator } from "../../user_resume/UserResumeValidator";
import { logValidationError } from "../../../logger";

export class CreateRequestValidator extends Responses {
  constructor() {
    super();
  }

  public validate(): MiddleWareFunctionType {
    return async (req: Request, res: Response, next: NextFunction) => {
      const parser = new CreateCoverLetterParser(req.body, userResumeValidator);
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

const createValidator = new CreateRequestValidator();
export { createValidator };
