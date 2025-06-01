// src/middlewares/PlanLimitChecker.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userQueries, paymentSubscriptionQueries } from "../db/queries";
import { planLimits } from "../helpers/constants/constant";

type UsageType =
  | "resumeUploads"
  | "tailoredResumes"
  | "coverLetters"
  | "githubAnalyses";

type MiddleWareFunctionType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export class PlanLimitChecker {
  constructor(private usageType: UsageType) {}

  public check(): MiddleWareFunctionType {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        await this.executeImpl(req, res, next);
      } catch (err) {
        console.error("[PlanLimitChecker]: Unexpected error", err);
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    };
  }

  private async executeImpl(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.decode(token) as any;

    if (!decoded || !decoded.user || !decoded.user.id) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const userId = decoded.user.id;

    const activeSubscription =
      await paymentSubscriptionQueries.getUserCurrentSubscription(userId);

    const plan = activeSubscription?.plan || "FREE";

    const user = await userQueries.getUserById(userId);

    if (user && user.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const currentUsage = user[0].usage?.[this.usageType] || 0;
    const limit = planLimits[plan][this.usageType];
    // console.log(
    //   `currentUsage: ${currentUsage}, limit: ${limit}, plan: ${plan}`
    // );

    if (currentUsage >= limit) {
      res.status(403).json({
        message: `You have reached your ${this.usageType} limit for the ${plan} plan. Please upgrade your plan to continue.`,
      });
      return;
    }

    return next();
  }
}
