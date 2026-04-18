// Backfill signup credits (10) to users who predate the credits system.
// Idempotent — only users with a null/missing/zero credit_balance get updated,
// and only if they don't already have a signup_grant ledger entry.

/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { userModel } from '../user';
import { creditTransactionModel } from '../credit_transaction';

export async function backfillCreditBalance(): Promise<{
  grantsAdded: number;
  balanceUpdates: number;
}> {
  // Find all users who have no credit_balance set (null, 0, or undefined).
  const users: any[] = await userModel
      .find({
        $or: [
          { credit_balance: null },
          { credit_balance: 0 },
          { credit_balance: { $exists: false } },
        ],
      })
      .lean();

  let grantsAdded = 0;
  let balanceUpdates = 0;

  for (const u of users) {
    const existing = await creditTransactionModel
        .findOne({
          user_id: u._id,
          reason: 'signup_grant',
        })
        .lean();

    if (!existing) {
      await creditTransactionModel.create({
        user_id: u._id,
        delta: 10,
        reason: 'signup_grant',
        source: 'system',
        reference_id: `backfill:${u._id}`,
        expires_on: null,
        metadata: { backfill: true },
      });
      grantsAdded += 1;
    }

    await userModel.updateOne({ _id: u._id }, { $set: { credit_balance: 10 } });
    balanceUpdates += 1;
  }

  console.log(
      `Backfill complete: ${grantsAdded} grants added, ${balanceUpdates} balances updated`,
  );
  return { grantsAdded, balanceUpdates };
}

if (require.main === module) {
  (async () => {
    const dbUri = process.env.DB_URI;
    if (!dbUri) {
      console.error('DB_URI env var is required to run the migration');
      process.exit(1);
    }
    await mongoose.connect(dbUri);
    try {
      await backfillCreditBalance();
    } finally {
      await mongoose.disconnect();
    }
    process.exit(0);
  })().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}
