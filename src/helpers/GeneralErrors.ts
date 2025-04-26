/**
 * These classes cover all the types of common errors
 * which can occur by the incoming request.
 * For e.g. if we expect the incoming request parameter to not be null,
 * we create a NullOrUndefined
 * Error which is used to propagate the message back the the API user.
 * All the errors consist of a code, message and property name (TODO:)
 * Before creating one error class refer the already created classes
 * to avoid duplicate and ensure consistency.
 */
import { GeneralError } from "../interfaces";

export class InvalidRange extends GeneralError {
  constructor(
    minValue: number,
    maxValue: number,
    value: number,
    field: string
  ) {
    super(
      "InvalidRange",
      // eslint-disable-next-line max-len
      `The value ${value} for ${field} is out of the range min: ${minValue} - max: ${maxValue} `,
      field
    );
  }
}

export class ExceededMaxValue extends GeneralError {
  constructor(maxValue: number, value: number, field: string) {
    super(
      "ExceededMaxValue",
      `The value ${value} is exceeds max value ${maxValue} `,
      field
    );
  }
}

export class BelowMinValue extends GeneralError {
  constructor(minValue: number, value: number, field: string) {
    super(
      "BelowMinValue",
      `The value ${value} is below min value ${minValue}`,
      field
    );
  }
}

export class NullOrUndefined extends GeneralError {
  constructor(field: string) {
    super("NullOrUndefined", `The ${field} is empty`, field);
  }
}

export class InvalidDate extends GeneralError {
  constructor(field: string, format: string) {
    super(
      "InvalidDate",
      `The date for ${field} is invalid, expected ${format}`,
      field
    );
  }
}

export class InvalidDateRange extends GeneralError {
  constructor(
    minValue: number,
    maxValue: number,
    value: number,
    field: string
  ) {
    super(
      "InvalidDateRange",
      // eslint-disable-next-line max-len
      `The value ${value} is out of the range min: ${minValue} - max: ${maxValue} `,
      field
    );
  }
}

// export class DbError extends GeneralError {
//   constructor() {
//     super("DbError", "Internal Server Error", "Unknown");
//   }
// }

export class DbError extends GeneralError {
  constructor() {
    super(
      "DbError",
      // eslint-disable-next-line max-len
      `Internal Server Error `,
      "Unknown"
    );
  }
}
export class InvalidFileFormatError extends GeneralError {
  constructor(field: string) {
    super("InvalidFileFormatError", "This file type is not allowed", field);
  }
}

export class InvalidLength extends GeneralError {
  constructor(minValue: number, maxValue: number, field: string) {
    super(
      "InvalidLength",
      // eslint-disable-next-line max-len
      `The Length of ${field} is out of the range min: ${minValue} - max: ${maxValue} `,
      field
    );
  }
}

export class InvalidENUM extends GeneralError {
  constructor(field: string, ENUM: string[]) {
    super(
      "InvalidENUM",
      `The ${field} should be among one of these ${ENUM.join(", ")}`,
      field
    );
  }
}

export class InvalidObjectId extends GeneralError {
  constructor(field: string) {
    super(
      "InvalidObjectId",
      `The Object id provided for ${field} is invalid`,
      field
    );
  }
}

export class NotANumber extends GeneralError {
  constructor(field: string) {
    super("NotANumber", `${field} is a invalid number`, field);
  }
}

export class InvalidDataType extends GeneralError {
  constructor(field: string, type: string) {
    super(
      "InvalidDataType",
      `${field} passed with invalid data type, expected: ${type}`,
      field
    );
  }
}
export class NotFound extends GeneralError {
  constructor(field: string) {
    super("NotFound", `${field} not found`, field);
  }
}

export class UnexpectedError extends GeneralError {
  constructor(message?: string) {
    super("UnexpectedError", `Unexpected error occurred ${message}`, "Unknown");
  }
}

export class InvalidEmail extends GeneralError {
  constructor(field: string) {
    super("InvalidEmail", "Invalid Email", field);
  }
}

export class InvalidFormat extends GeneralError {
  constructor(field: string) {
    super("InvalidFormat", `Invalid format for ${field}`, field);
  }
}

export class InvalidData extends GeneralError {
  constructor(field: string) {
    super("InvalidData", `Invalid data for ${field}`, field);
  }
}

export class InvalidField extends GeneralError {
  constructor(field: string) {
    super("InvalidField", `Invalid field for ${field}`, field);
  }
}
export class AuthorizationError extends GeneralError {
  constructor(field: string) {
    super("AuthorizationError", "You are not authorization", field);
  }
}
export class APIError extends GeneralError {
  constructor(msg: string) {
    super("API_ERROR", msg, "");
  }
}
export class customError extends GeneralError {
  constructor(string, msg: string, field = "") {
    super(string, msg, field);
  }
}
export class EmptyString extends GeneralError {
  constructor(field: string) {
    super("EMPTY_STRING", `The field: ${field} cannot be empty`, field);
  }
}
export class InvalidArray extends GeneralError {
  constructor(index: Array<any>, fieldName: string) {
    super(
      "INVALID_ARRAY",

      `The Array ${fieldName} is invalid at indexes [${index.toString()}]`,
      fieldName
    );
  }
}
export class InvalidObject extends GeneralError {
  constructor(invalidKeys: Array<any>, fieldName: string) {
    super(
      "INVALID_ARRAY",
      `The Object ${fieldName} has invalid keys - 
                  ${invalidKeys.toString()}`,
      fieldName
    );
  }
}
export class ValueLessThan extends GeneralError {
  constructor(fieldName1: string, fieldName2: string) {
    super(
      "VALUE_LESS_THAN",
      `${fieldName1} should be Less than ${fieldName2}`,
      fieldName1
    );
  }
}
export class ValueGreaterThan extends GeneralError {
  constructor(fieldName1: string, fieldName2: string) {
    super(
      "VALUE_GREATER_THAN",
      `${fieldName1} should be Greater than ${fieldName2}`,
      fieldName1
    );
  }
}

export class AuthenticationError extends GeneralError {
  constructor(field: string) {
    super("AuthenticationError", "You are not authenticated", field);
  }
}
