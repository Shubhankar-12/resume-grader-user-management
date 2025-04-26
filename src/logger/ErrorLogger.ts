import { errClass } from "../interfaces";
import { GeneralErrors } from "../helpers/";

import { config } from "../config";
import { LoggerParam } from "../interfaces/LoggerParam";
const logConfig = config.logger;

/**
 * log decorator to wrap a function by adding try catch where we
 * log any unexpected error and return the errClass
 * or return the result of the given function.
 * Note: Implementation assuming that the decorator will be used
 * on a async function
 * @param {LoggerParam} param
 */
function logUnexpectedUsecaseError(
  param: LoggerParam
): (
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void {
  if (param.critical === undefined) {
    param.critical = false;
  }
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): void => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (err: any) {
        if (!param.critical) {
          if (logConfig.LOG_IN_FILE) {
            global.logger[param.level](propertyKey + " " + err.stack);
          }
          if (logConfig.LOG_IN_DB) {
            global.dbLogger.log({
              level: param.level ? param.level : "error",
              category: "error",
              data: `${propertyKey} : ${err.stack}`,
            });
          }
        }
        return errClass(new GeneralErrors.UnexpectedError(err.message));
      }
    };
  };
}

function logUnexpectedValidatorError(
  param: LoggerParam,
  returnAsArray = false
): (
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void {
  if (param.critical === undefined) {
    param.critical = false;
  }
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): void => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      try {
        const result = originalMethod.apply(this, args);
        return result;
      } catch (err: any) {
        if (!param.critical) {
          if (logConfig.LOG_IN_FILE) {
            global.logger[param.level](propertyKey + " " + err.stack);
          }
          if (logConfig.LOG_IN_DB) {
            global.dbLogger.log({
              level: param.level ? param.level : "error",
              category: "error",
              data: `${propertyKey} ${err.stack}`,
            });
          }
        }
        if (returnAsArray) {
          return [errClass(new GeneralErrors.UnexpectedError())];
        } else {
          return errClass(new GeneralErrors.UnexpectedError());
        }
      }
    };
  };
}

export { logUnexpectedUsecaseError, logUnexpectedValidatorError };
