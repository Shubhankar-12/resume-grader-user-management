import { Request, Response, NextFunction } from "express";
import { Hook } from "../interfaces";
import { BaseLogger } from "../logger";
import { MongoClient, ObjectId } from "mongodb";
import { Types } from "mongoose";

class GeneralHook implements Hook {
  baseLogger: BaseLogger;
  constructor(baseLogger: BaseLogger) {
    this.baseLogger = baseLogger;
  }

  async preHookLogger(req: Request, res: Response): Promise<void> {
    const log_data = { req: this.baseLogger.makeRequestLog(req) };
    global.logger.info(log_data);
    const { insertedId } = await global.dbLogger.log({
      level: "info",
      category: "request",
      data: log_data,
    });
    res.locals.req_id = new ObjectId(insertedId);
  }

  postHookLogger(req: Request, res: Response): void {
    const log_data = this.baseLogger.makeResponseLog(req, res);
    global.logger.info(log_data);
    global.dbLogger.log({
      level: "info",
      category: "response",
      data: log_data,
    });
  }
  public preHook() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      await this.preHookLogger(req, res);
      return next();
    };
  }
  public postHook() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      await this.postHookLogger(req, res);
      return next();
    };
  }
}

export { GeneralHook };
