import mongoose from 'mongoose';
import { creditPackModel } from './model';

const rows = [
  {
    pack_id: 'PACK_10', credits: 10, region: 'GLOBAL', provider: 'stripe',
    provider_price_id: process.env.STRIPE_PRICE_PACK_10_USD || 'price_placeholder_pack_10_usd',
    amount: 499, currency: 'USD',
  },
  {
    pack_id: 'PACK_25', credits: 25, region: 'GLOBAL', provider: 'stripe',
    provider_price_id: process.env.STRIPE_PRICE_PACK_25_USD || 'price_placeholder_pack_25_usd',
    amount: 999, currency: 'USD',
  },
  {
    pack_id: 'PACK_60', credits: 60, region: 'GLOBAL', provider: 'stripe',
    provider_price_id: process.env.STRIPE_PRICE_PACK_60_USD || 'price_placeholder_pack_60_usd',
    amount: 1999, currency: 'USD',
  },
  {
    pack_id: 'PACK_10', credits: 10, region: 'IN', provider: 'razorpay',
    provider_price_id: null,
    amount: Number(process.env.RAZORPAY_AMOUNT_PACK_10_INR || 19900), currency: 'INR',
  },
  {
    pack_id: 'PACK_25', credits: 25, region: 'IN', provider: 'razorpay',
    provider_price_id: null,
    amount: Number(process.env.RAZORPAY_AMOUNT_PACK_25_INR || 49900), currency: 'INR',
  },
  {
    pack_id: 'PACK_60', credits: 60, region: 'IN', provider: 'razorpay',
    provider_price_id: null,
    amount: Number(process.env.RAZORPAY_AMOUNT_PACK_60_INR || 99900), currency: 'INR',
  },
];

export async function seedCreditPacks(): Promise<void> {
  for (const pack of rows) {
    await creditPackModel.updateOne(
        { pack_id: pack.pack_id, region: pack.region },
        { $set: pack },
        { upsert: true },
    );
  }
  console.log(`Seeded ${rows.length} credit_pack rows`);
}

if (require.main === module) {
  (async () => {
    const dbUri = process.env.DB_URI;
    if (!dbUri) {
      console.error('DB_URI env var is required to run the seed script');
      process.exit(1);
    }
    await mongoose.connect(dbUri);
    try {
      await seedCreditPacks();
    } finally {
      await mongoose.connection.close();
    }
    process.exit(0);
  })().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
