/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Request, Response,
} from 'express';
import {
  IApiMetaResponse, IResponseParams,
} from '../interfaces';

export class Responses {
  public created(result?: any): IResponseParams {
    const meta: IApiMetaResponse = {
      total_documents: 1,
      message: 'Created Successfully',
      data_type: result ?
        Array.isArray(result) ?
          'application/array' :
          'application/json' :
        'application/json',
    };
    const data: IResponseParams = {
      body: result,
      statusCode: 201,
      meta: meta,
      isSuccess: true,
      errors: null,
    };
    return data;
  }

  public success(result?: any, meta?: IApiMetaResponse): IResponseParams {
    if (!meta) {
      meta = {
        // if it is an array send length else send 1
        total_documents: Array.isArray(result) ? result.length : 1,
        message: 'Request Successfully',
        error: '',
        pagination: {
          current_page: 0,
          next_page: 0,
          previous_page: 0,
          limit: 0,
        },
        data_type: result ?
          Array.isArray(result) ?
            'application/array' :
            'application/json' :
          'application/json',
      };
    }
    const data: IResponseParams = {
      body: result ? result : null,
      statusCode: 200,
      meta: meta,
      isSuccess: true,
      errors: null,
    };
    return data;
  }

  public fail(options: {
    errors?: any,
    meta?: IApiMetaResponse,
    message?: string,
    statusCode?: number
  }
  ): IResponseParams {
    if (!options.meta) {
      options.meta = {
        total_documents: 0,
        message: options.message ? options.message : 'Request Failed',
        error: options.statusCode == 400 ?
         'Bad Request' : 'Internal Server Error',
        data_type: 'application/json',
      };
    }
    const data: IResponseParams = {
      body: null,
      statusCode: options.statusCode ? options.statusCode : 500,
      meta: options.meta,
      isSuccess: false,
      errors: Array.isArray(options.errors) ? options.errors : [options.errors],
    };
    return data;
  }

  public jsonResponse(res: Response, status: number, message: string) {
    message;
    return;
  }

  public clientError(res: Response, message?: string): void {
    return this.jsonResponse(res, 400, message ? message : 'Unauthorized');
  }

  public unauthorized(res: Response, errors: Array<any>): any {
    return {
      isSuccess: false,
      statusCode: 401,
      errors: errors,
      body: null,
    };
  }

  public paymentRequired(res: Response, message?: string): void {
    return this.jsonResponse(res, 402, message ? message : 'Payment required');
  }

  public forbidden(res: Response, message?: string): void {
    return this.jsonResponse(res, 403, message ? message : 'Forbidden');
  }

  public notFound(res: Response, message?: string): void {
    return this.jsonResponse(res, 404, message ? message : 'Not found');
  }

  public conflict(res: Response, message?: string): void {
    return this.jsonResponse(res, 409, message ? message : 'Conflict');
  }

  public tooMany(res: Response, message?: string): void {
    return this.jsonResponse(res, 429, message ? message : 'Too many requests');
  }

  public todo(res: Response): void {
    return this.jsonResponse(res, 400, 'TODO');
  }

  public storeResponse(res: Response, result: any): void {
    res.locals.response = result;
  }

  public sendResponse(
      req: Request,
      res: Response,
  ): void {
    res.status(res.locals.response.statusCode ?
      res.locals.response.statusCode : 500);

    const result: IResponseParams = {
      isSuccess: res.locals.response.isSuccess,
      meta: { ...res.locals.response.meta },
      statusCode: res.locals.response.statusCode,
      errors: res.locals.response.errors,
      body: {},
    };
    if (Array.isArray(res.locals.response.data)) {
      result.body.push(...res.locals.response.body);
    } else {
      result.body = res.locals.response.body;
    }
    res.send(result);
  }
  public sendResponseMiddleware() {
    return async (
        req: Request,
        res: Response,
    ): Promise<void> => {
      this.sendResponse(req, res);
    };
  }
}
