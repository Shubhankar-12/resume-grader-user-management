/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose';
import { creditTransactionModel } from '../../db/credit_transaction';
import { creditTransactionQueries } from '../../db/queries/CreditTransactionQueries';
import { userQueries } from '../../db/queries';

// Marker doc — one per expired grant reference_id — prevents repeat work.
const ExpirySeenSchema = new Schema(
    {
      reference_id: { type: String, required: true, unique: true },
      seen_at: { type: Date, default: Date.now },
    },
    { collection: 'credit_expiry_seen' },
);
const ExpirySeenModel = model('CreditExpirySeen', ExpirySeenSchema, 'credit_expiry_seen');

/**
 * Hourly sweeper that reconciles `user.credit_balance` with the ledger-truth
 * balance whenever a subscription grant has newly expired.
 *
 * Design note: this DOES NOT write compensating `recordMonthlyExpiry` entries.
 * If a user has already consumed part of a monthly grant, a compensating
 * full-grant negative delta would over-decrement and could drop the cache
 * below zero. Instead, the sweeper reconciles the user's cached balance to
 * `creditTransactionQueries.getBalance(userId)` — which already filters out
 * expired grants via `expires_on IS NULL OR > NOW()`.
 *
 * The `credit_expiry_seen` marker collection tracks which grants have been
 * seen, so we don't reconcile the same user repeatedly each hour for the
 * same expired grant.
 */
export async function sweepMonthlyExpiry(): Promise<{
  affectedUserCount: number;
  expiredGrantCount: number;
}> {
  const now = new Date();
  const expired: any[] = await creditTransactionModel
      .find({
        reason: 'subscription_grant',
        expires_on: { $lte: now, $ne: null },
      })
      .lean();

  const affectedUsers = new Set<string>();
  let newlySeenGrants = 0;
  for (const grant of expired) {
    try {
      await ExpirySeenModel.create({ reference_id: grant.reference_id });
      affectedUsers.add(String(grant.user_id));
      newlySeenGrants += 1;
    } catch (e: any) {
      if (e.code !== 11000) throw e;
      // Duplicate key = already swept; skip.
    }
  }

  for (const userId of affectedUsers) {
    const trueBalance = await creditTransactionQueries.getBalance(userId);
    await userQueries.setCreditBalance(userId, trueBalance);
  }

  return { affectedUserCount: affectedUsers.size, expiredGrantCount: newlySeenGrants };
}
