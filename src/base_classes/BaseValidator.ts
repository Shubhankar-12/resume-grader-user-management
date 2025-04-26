/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import validator from "validator";
import { ObjectId } from "mongodb";
import {
  NotFound,
  InvalidDataType,
  NullOrUndefined,
  InvalidLength,
  NotANumber,
  InvalidObjectId,
  BelowMinValue,
  EmptyString,
  ExceededMaxValue,
  InvalidArray,
  InvalidEmail,
  InvalidENUM,
  ValueLessThan,
  GeneralErrors,
  InvalidFileFormatError,
} from "../helpers";
import { Either, errClass, GeneralError, successClass } from "../interfaces";
import { logUnexpectedValidatorError } from "../logger";
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

type Response = Either<GeneralError, boolean>;

export class BaseValidator {
  @logUnexpectedValidatorError({ level: "error" })
  stringCheck(field: any, fieldName: string): Response {
    if (field == undefined) {
      return errClass(new NotFound(fieldName));
    } else if (typeof field !== "string") {
      return errClass(new InvalidDataType(fieldName, "string"));
    } else if (field.trim().length === 0) {
      return errClass(new EmptyString(fieldName));
    } else {
      return successClass(true);
    }
  }
  @logUnexpectedValidatorError({ level: "error" })
  numberCheck(
    field: any,
    fieldName: string,
    min?: number,
    max?: number
  ): Response {
    if (field == undefined) {
      return errClass(new NotFound(fieldName));
    } else if (isNaN(Number(field))) {
      return errClass(new NotANumber(fieldName));
    } else if (min && field.length < min) {
      return errClass(new BelowMinValue(min, field, fieldName));
    } else if (max && field.length > max) {
      return errClass(new ExceededMaxValue(max, field, fieldName));
    } else {
      return successClass(true);
    }
  }
  @logUnexpectedValidatorError({ level: "error" })
  booleanCheck(field: any, fieldName: string): Response {
    if (field == undefined) {
      return errClass(new NotFound(fieldName));
    } else if (typeof field !== "boolean") {
      return errClass(new InvalidDataType("boolean", fieldName));
    } else {
      return successClass(true);
    }
  }
  @logUnexpectedValidatorError({ level: "error" })
  EmailCheck(email: any, fieldName: string): Response {
    const result = this.stringCheck(email, fieldName);
    if (result.isErrClass()) return result;
    // eslint-disable-next-line max-len
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(email)) return successClass(true);
    else return errClass(new InvalidEmail(fieldName));
  }
  @logUnexpectedValidatorError({ level: "error" })
  validateStringEnum(
    data: any,
    enums: Array<string>,
    fieldName: string
  ): Response {
    if (data == undefined || data == null) {
      return errClass(new NullOrUndefined(fieldName));
    } else if (typeof data !== "string") {
      return errClass(new InvalidDataType(fieldName, "string"));
    } else if (data.trim().length == 0) {
      return errClass(new EmptyString(fieldName));
    } else if (enums.indexOf(data) == -1) {
      return errClass(new InvalidENUM(fieldName, enums));
    }
    return successClass(true);
  }
  @logUnexpectedValidatorError({ level: "error" })
  validateMultipleStringEnum(
    data: any,
    enums: Array<string>,
    fieldName: string
  ): Response {
    console.log("BaseValidators -> data", data);
    if (data == undefined || data == null) {
      return errClass(new NullOrUndefined(fieldName));
    } else if (data.length == 0) {
      return errClass(new EmptyString(fieldName));
    }
    const invalidIndex: number[] = [];
    data.map((elem, index): Response => {
      if (enums.indexOf(elem) == -1) {
        invalidIndex.push(index);
        return errClass(new InvalidENUM(fieldName, enums));
      }
      return successClass(true);
    });
    console.log("BaseValidators -> invalidIndex", invalidIndex);
    if (invalidIndex.length) {
      return errClass(new InvalidArray(invalidIndex, fieldName));
    }
    return successClass(true);
  }
  @logUnexpectedValidatorError({ level: "error" })
  shouldBeLessThan(
    data1: any,
    fieldName1: string,
    data2: any,
    fieldName2: string
  ): Response {
    if (data1 > data2) {
      return errClass(new ValueLessThan(fieldName1, fieldName2));
    }
    return successClass(true);
  }
  @logUnexpectedValidatorError({ level: "error" })
  shouldBeGreaterThen(
    data1: any,
    fieldName1: string,
    data2: any,
    fieldName2: string
  ): Response {
    if (data1 < data2) {
      return errClass(new ValueLessThan(fieldName1, fieldName2));
    }
    return successClass(true);
  }
  @logUnexpectedValidatorError({ level: "error" })
  validateOtp(value: any): Response {
    const field = "otp";
    if (value == undefined) {
      return errClass(new NotFound(field));
    } else if (typeof value != "string") {
      return errClass(new InvalidDataType(field, "string"));
    } else if (value.length == 0) {
      return errClass(new NullOrUndefined(field));
    } else if (value.length != 4) {
      return errClass(new InvalidLength(4, 4, field));
    } else if (!validator.isNumeric(value)) {
      return errClass(new NotANumber(field));
    } else {
      return successClass(true);
    }
  }

  /**
   * @param field_name the name of the field_name
   * @param value the value of the field
   */
  @logUnexpectedValidatorError({ level: "error" })
  stringArrayCheck(field_name: string, value: any): Response {
    if (value == undefined) {
      return errClass(new NotFound(field_name));
    } else if (!(value instanceof Array)) {
      return errClass(new InvalidDataType(field_name, "Array"));
    } else {
      let result: Response | null = null;
      for (let i = 0; i < value.length; i++) {
        result = this.stringCheck(value[i], field_name + " at " + i);
        if (result.isErrClass()) {
          i = value.length;
        }
      }
      if (result && result.isErrClass()) {
        return result;
      }
      return successClass(true);
    }
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateId(field, value): Response {
    if (value == undefined) {
      return errClass(new NotFound(field));
    } else if (typeof value !== "string") {
      return errClass(new InvalidDataType(field, "string"));
    } else if (value.length === 0) {
      return errClass(new NullOrUndefined(field));
    } else if (!ObjectId.isValid(value)) {
      return errClass(new InvalidObjectId(field));
    } else {
      return successClass(true);
    }
  }

  @logUnexpectedValidatorError({ level: "error" })
  validateIds(ids: Array<any>, field: string): Array<Response> {
    const errors: Array<any> = [];
    for (const id of ids) {
      if (typeof id != "string") {
        errors.push(
          errClass(new GeneralErrors.InvalidDataType(field, "string"))
        );
      }
      if (!ObjectId.isValid(id)) {
        errors.push(errClass(new GeneralErrors.InvalidObjectId(field)));
      }
    }
    if (errors.length == 0) {
      return [successClass(true)];
    } else {
      return errors;
    }
  }

  @logUnexpectedValidatorError({ level: "error" })
  imageFileTypeCheck(field_name: string, value: any): Response {
    if (value == undefined) {
      return errClass(new NotFound(field_name));
    } else if (typeof value !== "string") {
      return errClass(new InvalidDataType(field_name, "string"));
    } else if (value.length === 0) {
      return errClass(new NullOrUndefined(field_name));
    } else if (!ALLOWED_MIME_TYPES.includes(value)) {
      return errClass(new InvalidFileFormatError(field_name));
    } else {
      return successClass(true);
    }
  }
  @logUnexpectedValidatorError({ level: "error" })
  dateCheck(field: any, fieldName: string): Response {
    if (field == undefined) {
      return errClass(new NotFound(fieldName));
    } else if (typeof field !== "string") {
      return errClass(new InvalidDataType(fieldName, "string"));
    } else if (field.trim().length === 0) {
      return errClass(new EmptyString(fieldName));
    } else if (!validator.isISO8601(field)) {
      return errClass(new InvalidDataType(fieldName, "date"));
    } else {
      return successClass(true);
    }
  }
}
