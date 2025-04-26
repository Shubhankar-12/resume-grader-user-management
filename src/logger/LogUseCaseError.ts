import { UseCaseError } from '../interfaces';
import { config } from '../config';
import { LoggerParam } from '../interfaces';
import { baseLogger } from '.';
import { Response } from 'express';

const logConfig = config.logger;

function logUseCaseError(
    errors: UseCaseError[], logger_params: LoggerParam, res: Response): void {
  if (!logger_params.critical) {
    const log = baseLogger.makeUseCaseLog(res, errors);

    if (logConfig.LOG_IN_FILE) {
      global.logger.log(logger_params.level, 'UseCase Error', log);
    }

    if (logConfig.LOG_IN_DB) {
      // adding the ids for reference

      global.dbLogger.log({
        category: 'usecase-error',
        level: logger_params.level,
        data: log,
      });
      global.dbLogger.logError({
        category: 'usecase-error',
        level: logger_params.level,
        data: log,

      });
    }
  }
}

export { logUseCaseError };
