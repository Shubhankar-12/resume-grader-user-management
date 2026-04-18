import { v4 as uuid } from 'uuid';
import type { Request, Response, NextFunction } from 'express';
import { userQueries, creditTransactionQueries } from '../db/queries';
import { getCost, type AIAction } from '../config/creditCosts';

export function requireCredits(action: AIAction) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: string | undefined = (res.locals as any)?.auth?.decoded_token?.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'UNAUTHENTICATED' });
      return;
    }

    const cost = getCost(action);
    const ok = await userQueries.tryDeductCreditBalance(userId, cost);
    if (!ok) {
      res.status(402).json({ error: 'INSUFFICIENT_CREDITS', creditsNeeded: cost });
      return;
    }

    const preJobId = uuid();

    try {
      await creditTransactionQueries.recordConsumption({
        userId,
        cost,
        action,
        jobId: preJobId,
      });
    } catch (e) {
      await userQueries.incrementCreditBalance(userId, cost).catch(() => { /* swallow */ });
      res.status(500).json({ error: 'CREDIT_LEDGER_ERROR' });
      return;
    }

    (res.locals as any).creditContext = {
      preJobId, cost, action, userId,
    };
    next();
  };
}
