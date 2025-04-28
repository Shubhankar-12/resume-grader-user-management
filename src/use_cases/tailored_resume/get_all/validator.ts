import { Request, Response, NextFunction } from "express";
import { MiddleWareFunctionType, Responses } from "../../../helpers";
import { GetAllTailoredResumesParser } from "./parser";
import { logValidationError } from "../../../logger";
import { tailoredResumeValidator } from "../TailoredResumeValidator";

export class GetAllFiscalYearRequestValidator extends Responses {
  constructor() {
    super();
  }

  public validate(): MiddleWareFunctionType {
    return async (req: Request, res: Response, next: NextFunction) => {
      const parser = new GetAllTailoredResumesParser(
        req.query,
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

const getAllTailoredResumesValidator = new GetAllFiscalYearRequestValidator();
export { getAllTailoredResumesValidator };
