import { Either, errClass, GeneralError, successClass } from "../../interfaces";
import { logUnexpectedValidatorError } from "../../logger";
import { BaseValidator } from "../../base_classes/BaseValidator";
import {
  InvalidDataType,
  InvalidENUM,
  NotFound,
  NullOrUndefined,
} from "../../helpers";

type Response = Either<GeneralError, boolean>;

export class ImageValidator extends BaseValidator {
  @logUnexpectedValidatorError({ level: "error" })
  validateTitle(value: any): Response {
    const field = "title";
    return this.stringCheck(value, field);
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateUrl(value: any): Response {
    const field = "url";
    return this.stringCheck(value, field);
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateSortOrder(value: any): Response {
    const field = "sort_order";
    return this.numberCheck(value, field);
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateForeignId(value: any): Response {
    const field = "foreign_id";
    return this.validateId(field, value);
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateImageId(value: any): Response {
    const field = "image_id";
    return this.validateId(field, value);
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateForeignType(value: any): Response {
    const field = "foreign_type";
    return this.stringCheck(value, field);
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateFileType(value: any): Response {
    const field = "image";
    return this.imageFileTypeCheck(field, value);
  }
}

export const imageValidator = new ImageValidator();
