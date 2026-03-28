import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../services/redis";
import { Request, Response, NextFunction } from "express";
import { MiddleWareFunctionType } from "../helpers";

const PLAN_LIMITS = {
  ai: {
    FREE: { windowMs: 60 * 60 * 1000, max: 5 },
    BASIC: { windowMs: 60 * 60 * 1000, max: 20 },
    PRO: { windowMs: 60 * 60 * 1000, max: 100 },
  },
  general: {
    FREE: { windowMs: 60 * 1000, max: 20 },
    BASIC: { windowMs: 60 * 1000, max: 60 },
    PRO: { windowMs: 60 * 1000, max: 120 },
  },
};

function getPlanFromRequest(req: Request): "FREE" | "BASIC" | "PRO" {
  const auth = (req as any).res?.locals?.auth;
  return auth?.plan || "FREE";
}

function createRedisStore(prefix: string): RedisStore | undefined {
  const client = redisClient.getClient();
  if (!client) return undefined;
  return new RedisStore({
    prefix,
    sendCommand: (...args: string[]) =>
      client.call(args[0], ...args.slice(1)) as Promise<
        boolean | number | string
      >,
  });
}

export function createAIRateLimiter(): MiddleWareFunctionType {
  const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: (req: Request) => {
      const plan = getPlanFromRequest(req);
      return PLAN_LIMITS.ai[plan]?.max || 5;
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore("rl:ai:"),
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Too many AI requests. Please try again later.",
          retryAfter: 3600,
        },
      });
    },
  });
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return new Promise<void>((resolve) => {
      limiter(req, res, (err?: unknown) => {
        if (err) {
          next(err);
        } else {
          next();
        }
        resolve();
      });
    });
  };
}

export function createGeneralRateLimiter() {
  return rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore("rl:general:"),
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Too many requests. Please try again later.",
          retryAfter: 60,
        },
      });
    },
  });
}
