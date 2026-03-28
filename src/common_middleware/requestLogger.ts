import { Request, Response, NextFunction } from "express";
import { makeLogger } from "../logger/Config";

const logger = makeLogger({});

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const auth = res.locals?.auth;

    logger.info("request", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      responseTimeMs: duration,
      userId: auth?.user?.id || null,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      timestamp: new Date().toISOString(),
    });
  });

  next();
}
