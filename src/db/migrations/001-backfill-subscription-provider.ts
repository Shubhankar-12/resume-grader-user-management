// Backfill region/provider/currency on users and payment_subscriptions that predate
// the multi-provider rollout. Idempotent — only updates docs missing these fields.

import mongoose from 'mongoose';
import { paymentSubscriptionModel } from '../payment_subscription';
import { userModel } from '../user';

export async function backfillSubscriptionProvider(): Promise<void> {
  const subResult: any = await paymentSubscriptionModel.updateMany(
      { provider: { $exists: false } },
      { $set: { provider: 'razorpay', region: 'IN', currency: 'INR' } }
  );
  const subModified = subResult.modifiedCount ?? subResult.nModified ?? 0;
  console.log(`Backfilled ${subModified} subscriptions`);

  const userResult: any = await userModel.updateMany(
      { region: { $exists: false } },
      { $set: { region: 'IN', currency: 'INR' } }
  );
  const userModified = userResult.modifiedCount ?? userResult.nModified ?? 0;
  console.log(`Backfilled ${userModified} users`);
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
      await backfillSubscriptionProvider();
    } finally {
      await mongoose.disconnect();
    }
    process.exit(0);
  })().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}
