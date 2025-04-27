import { Request, Response, NextFunction } from "express";
import { MiddleWareFunctionType, Responses } from "../../../helpers";
import { CreateTailoredResumeParser } from "./parser";
import { tailoredResumeValidator } from "../TailoredResumeValidator";
import { logValidationError } from "../../../logger";

export class CreateTailoredResumeRequestValidator extends Responses {
  constructor() {
    super();
  }

  public validate(): MiddleWareFunctionType {
    return async (req: Request, res: Response, next: NextFunction) => {
      const parser = new CreateTailoredResumeParser(
        req.body,
        tailoredResumeValidator
      );
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

const createTailoredResumeValidator =
  new CreateTailoredResumeRequestValidator();
export { createTailoredResumeValidator };
