import { IError } from '../interfaces';
import { config } from '../config';
import { LoggerParam } from '../interfaces';
import { baseLogger } from '.';
import { Response } from 'express';

const logConfig = config.logger;

function logValidationError(
    errors: IError[],
    logger_params: LoggerParam,
    res: Response): void {
  if (!logger_params.critical) {
    const log = baseLogger.makeValidationLog(res, errors);

    if (logConfig.LOG_IN_FILE) {
      global.logger.log(logger_params.level, 'Validation Error', log);
    }

    if (logConfig.LOG_IN_DB) {
      global.dbLogger.log({
        category: 'validation-error',
        level: logger_params.level,
        data: log,
      });
      global.dbLogger.logError({
        category: 'validation-error',
        level: logger_params.level,
        data: log,

      });
    }
  }
}

export { logValidationError };
