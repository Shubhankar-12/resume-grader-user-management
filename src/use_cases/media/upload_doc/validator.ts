import { Request, Response, NextFunction } from "express";
import { MiddleWareFunctionType, Responses } from "../../../helpers";
import { UploadDocParser } from "./parser";
import { imageValidator } from "../ImageValidator";
import { logValidationError } from "../../../logger";

export class UploadDocRequestValidator extends Responses {
  constructor() {
    super();
  }

  public validate(): MiddleWareFunctionType {
    return async (req: Request, res: Response, next: NextFunction) => {
      const parser = new UploadDocParser(req.body, imageValidator);
      const bodyErrors = parser.getErrors();
      if (bodyErrors.length == 0) return next();
      else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errors: Array<any> = [];
        errors.push(...bodyErrors);

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

const uploadDocValidator = new UploadDocRequestValidator();
export { uploadDocValidator };
