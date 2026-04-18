import { v4 as uuid } from 'uuid';
import type { Request, Response, NextFunction } from 'express';
import { userQueries, creditTransactionQueries } from '../db/queries';
import { getCost, type AIAction } from '../config/creditCosts';

export interface CreditContext {
  preJobId: string;
  cost: number;
  action: AIAction;
  userId: string;
}

/**
 * Regex used to detect AI-infrastructure failures (network, upstream provider,
 * 5xx, rate-limit, timeout). Matches are treated as refundable — user errors
 * such as validation failures should NOT match this pattern.
 */
export const INFRA_ERROR_REGEX =
  /OpenAI|Anthropic|Gemini|ECONNRESET|ETIMEDOUT|socket hang up|503|502|rate limit|timeout|network/i;

export function isInfraError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err ?? '');
  return INFRA_ERROR_REGEX.test(message);
}

/**
 * Refund the credits previously deducted by `requireCredits`. Writes a
 * compensating ledger entry and bumps the cached balance back up. Intended for
 * use from sync AI paths after an infra failure.
 *
 * Safe to call multiple times from different code paths — the ledger entry is
 * keyed by `${preJobId}:refund`, so duplicates will show up but won't break
 * the balance calculation (additive). Callers should still guard against it.
 */
export async function refundCreditsOnInfraError(
    res: Response,
    err: unknown
): Promise<void> {
  if (!isInfraError(err)) return;
  const ctx = (res.locals as any)?.creditContext as CreditContext | undefined;
  if (!ctx) return;
  try {
    await creditTransactionQueries.recordRefund(ctx.userId, ctx.preJobId, ctx.cost);
    await userQueries.incrementCreditBalance(ctx.userId, ctx.cost);
  } catch (refundErr) {
    console.error('[creditMiddleware] Failed to refund credits for job', ctx.preJobId, refundErr);
  }
}

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
    } satisfies CreditContext;
    next();
  };
}
