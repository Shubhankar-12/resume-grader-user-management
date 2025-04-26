import { IError } from '../interfaces';
import { LoggerParam } from '../interfaces';
import { baseLogger } from '.';
import { Response } from 'express';


export function logAuthenticationError(
    errors: IError[], logger_params: LoggerParam, res: Response): void {
  if (!logger_params.critical) {
    const log = baseLogger.makeAuthenticationLog(res, errors);

    if (process.env.LOG_IN_FILE == 'true') {
      global.logger.log(logger_params.level, 'Authentication Error', log);
    }

    if (process.env.LOG_IN_DB == 'true') {
      global.dbLogger.log({
        category: 'authentication-error',
        level: logger_params.level,
        data: log,
      });
      global.dbLogger.logError({
        category: 'authentication-error',
        level: logger_params.level,
        data: log,

      });
    }
  }
}
