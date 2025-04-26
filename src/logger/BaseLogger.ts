import {
  Request, Response,
} from 'express';
import { LoggerUtils } from '../helpers/utils';
import {
  IError, RequestLog,
} from '../interfaces';
import { ResponseLog } from '../interfaces';
import { ValidationErrorLog } from '../interfaces';
import { UseCaseErrorLog } from '../interfaces';

class BaseLogger {
  makeRequestLog(req: Request): RequestLog {
    const req_body = LoggerUtils.hideFields(req.body);
    return {
      headers: req.headers,
      method: req.method,
      originalUrl: req.originalUrl,
      params: req.params,
      query: req.query,
      body: req_body,
    };
  }

  makeResponseLog(req: Request, res: Response): ResponseLog {
    // console.log('before ', res.locals.response.body);
    const response_body =
      LoggerUtils.hideFields(res.locals.response.body);
    // console.log('after', response_body);
    const log = {
      req_id: res.locals.req_id,
      res: { locals: JSON.parse(JSON.stringify(res.locals)) },
    };
    log.res.locals.response.body = response_body;
    return log;
  }

  makeValidationLog(res: Response, errors: IError[]): ValidationErrorLog {
    return {
      req_id: res.locals.req_id,
      errors: errors,
    };
  }

  makeUseCaseLog(res: Response, errors: IError[]): UseCaseErrorLog {
    return {
      req_id: res.locals.req_id,
      errors: errors,
    };
  }

  makeAuthenticationLog(res: Response, errors: IError[]): UseCaseErrorLog {
    return {
      req_id: res.locals.req_id,
      errors: errors,
    };
  }
}
const baseLogger = new BaseLogger();

export {
  baseLogger, BaseLogger,
};
