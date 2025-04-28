import { Request, Response, NextFunction } from "express";
import { MiddleWareFunctionType, Responses } from "../../../helpers";
import { CreateMatchReportParser } from "./parser";
import { tailoredResumeValidator } from "../TailoredResumeValidator";
import { logValidationError } from "../../../logger";

export class CreateMatchReportRequestValidator extends Responses {
  constructor() {
    super();
  }

  public validate(): MiddleWareFunctionType {
    return async (req: Request, res: Response, next: NextFunction) => {
      const parser = new CreateMatchReportParser(
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

const createMatchReportValidator = new CreateMatchReportRequestValidator();
export { createMatchReportValidator };
