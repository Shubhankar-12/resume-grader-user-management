import {
  createLogger,
  format,
  Logger,
  LoggerOptions,
  transports,
} from "winston";

import { DataBaseLogger } from "./DatabaseLogger";
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      logger: Logger;
      dbLogger: DataBaseLogger;
    }
  }
}

interface IMakeLoggerOptions {
  logFile?: boolean;

  FILE_PATH?: string;
}

function makeLogger(options: IMakeLoggerOptions): Logger {
  const log_transports: transports.FileTransportInstance[] = [];
  const create_options: LoggerOptions = {};

  // adding configuration for logging into file
  if (options.logFile) {
    if (options.FILE_PATH === undefined) {
      throw new Error("Please provide a FILE_PATH");
    }
    const ob = new transports.File({
      filename: options.FILE_PATH,
      format: format.json(),
    });
    log_transports.push(ob);
  }

  create_options.transports = log_transports;

  return createLogger(create_options);
}

export { makeLogger };
