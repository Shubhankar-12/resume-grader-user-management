/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import validator from "validator";
import { Types } from "mongoose";
import {
  NotFound,
  NullOrUndefined,
  InvalidLength,
  InvalidDataType,
  InvalidObjectId,
  InvalidENUM,
  InvalidEmail,
  InvalidDate,
} from "../../helpers/GeneralErrors";
import { Either, errClass, GeneralError, successClass } from "../../interfaces";
import { logUnexpectedValidatorError } from "../../logger";
import {
  BloodGroupArray,
  EmployeeStatusArray,
  GenderArray,
  TitleArray,
} from "../../helpers/constants/employee";
import { StatusArray } from "../../helpers/constants/constant";
import { BaseValidator } from "../../base_classes/BaseValidator";

const ObjectId = Types.ObjectId;
type Response = Either<GeneralError, boolean>;

export class TailoredResumeValidator extends BaseValidator {
  private common_message = "user_resume ";
  @logUnexpectedValidatorError({ level: "error" })
  validateString(value: any, field: string): Response {
    if (value == undefined) {
      return errClass(new NotFound(field));
    } else if (typeof value != "string") {
      return errClass(new InvalidDataType(field, "string"));
    } else if (value.length == 0) {
      return errClass(new NullOrUndefined(field));
    } else if (value.length < 3 || value.length > 20) {
      return errClass(new InvalidLength(3, 20, field));
    } else {
      return successClass(true);
    }
  }
  @logUnexpectedValidatorError({ level: "error" })
  validateStatus(value: any): Response {
    const field = "status";
    if (value == undefined) {
      return errClass(new NotFound(field));
    } else if (typeof value != "string") {
      return errClass(new InvalidDataType(field, "string"));
    } else if (value.length == 0) {
      return errClass(new NullOrUndefined(field));
    } else if (StatusArray.indexOf(value) == -1) {
      return errClass(new InvalidENUM(field, StatusArray));
    } else {
      return successClass(true);
    }
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateLimit(value: any): Response {
    const field = this.common_message + "limit";
    return this.numberCheck(value, field);
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateSkip(value: any): Response {
    const field = this.common_message + "skip";
    return this.numberCheck(value, field);
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateSort(value: any): Response {
    const field = this.common_message + "sort";
    return this.stringCheck(value, field);
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateFilter(value: any): Response {
    const field = this.common_message + "filter";
    return this.stringCheck(value, field);
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateSearch(value: any): Response {
    const field = this.common_message + "search";
    return this.stringCheck(value, field);
  }
}

export const tailoredResumeValidator = new TailoredResumeValidator();
