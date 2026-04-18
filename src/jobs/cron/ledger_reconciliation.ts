/* eslint-disable @typescript-eslint/no-explicit-any */
import { creditTransactionQueries } from '../../db/queries/CreditTransactionQueries';
import { userQueries } from '../../db/queries';

/**
 * Nightly job that detects drift between the `user.credit_balance` cache and
 * the ledger-truth balance computed from credit_transactions. Whenever drift
 * is found, the cache is corrected to match the ledger and the event is
 * logged (and reported to Sentry if available).
 *
 * Scale note: this MVP iterates every user. For Phase 2 volume this is fine,
 * but as the user table grows we should narrow the scan to users with either
 * a non-zero credit_balance or any ledger activity in the last 60 days.
 */
export async function reconcileLedgerDrift(): Promise<{
  checked: number;
  driftCount: number;
  driftedUsers: string[];
}> {
  const userIds = await userQueries.listAllUserIds();
  const drifted: string[] = [];
  let driftCount = 0;

  for (const userId of userIds) {
    const ledgerBalance = await creditTransactionQueries.getBalance(userId);
    const cachedUserResult: any = await userQueries.getUserById(userId);
    const user = Array.isArray(cachedUserResult) ? cachedUserResult[0] : cachedUserResult;
    if (!user) continue;
    const cachedBalance = user.credit_balance ?? 0;

    if (ledgerBalance !== cachedBalance) {
      console.warn(
          `[cron] credit_balance drift for user ${userId}: cache=${cachedBalance}, ledger=${ledgerBalance}`,
      );
      // If @sentry/node is installed and in use, capture a warning.
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Sentry = require('@sentry/node');
        Sentry.captureMessage?.(
            `credit_balance drift for user ${userId}: cache=${cachedBalance}, ledger=${ledgerBalance}`,
        );
      } catch {
        /* Sentry not available — skip. */
      }
      await userQueries.setCreditBalance(userId, ledgerBalance);
      drifted.push(userId);
      driftCount += 1;
    }
  }

  return { checked: userIds.length, driftCount, driftedUsers: drifted };
}
