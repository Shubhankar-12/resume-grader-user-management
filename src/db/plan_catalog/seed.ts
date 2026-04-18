import mongoose from 'mongoose';
import { PlanCatalog } from './model';

const seedData = [
  {
    plan_id: 'STARTER', region: 'GLOBAL', provider: 'stripe',
    provider_price_id: process.env.STRIPE_PRICE_STARTER_USD || 'price_placeholder_starter_usd',
    amount: 900, currency: 'USD', monthly_credits: 20,
    features: { resumeUploads: 10, aiGrades: 20, coverLetters: 10 },
  },
  {
    plan_id: 'PRO', region: 'GLOBAL', provider: 'stripe',
    provider_price_id: process.env.STRIPE_PRICE_PRO_USD || 'price_placeholder_pro_usd',
    amount: 1900, currency: 'USD', monthly_credits: 100,
    features: { resumeUploads: 50, aiGrades: 100, coverLetters: 50 },
  },
  {
    plan_id: 'CAREER_PLUS', region: 'GLOBAL', provider: 'stripe',
    provider_price_id: process.env.STRIPE_PRICE_CAREER_PLUS_USD || 'price_placeholder_career_plus_usd',
    amount: 3900, currency: 'USD', monthly_credits: 300,
    features: { resumeUploads: 200, aiGrades: 300, coverLetters: 200 },
  },
  {
    plan_id: 'STARTER', region: 'IN', provider: 'razorpay',
    provider_price_id: process.env.RAZORPAY_PLAN_STARTER_INR || 'plan_placeholder_starter_inr',
    amount: 29900, currency: 'INR', monthly_credits: 20,
    features: { resumeUploads: 10, aiGrades: 20, coverLetters: 10 },
  },
  {
    plan_id: 'PRO', region: 'IN', provider: 'razorpay',
    provider_price_id: process.env.RAZORPAY_PLAN_PRO_INR || 'plan_placeholder_pro_inr',
    amount: 59900, currency: 'INR', monthly_credits: 100,
    features: { resumeUploads: 50, aiGrades: 100, coverLetters: 50 },
  },
  {
    plan_id: 'CAREER_PLUS', region: 'IN', provider: 'razorpay',
    provider_price_id: process.env.RAZORPAY_PLAN_CAREER_PLUS_INR || 'plan_placeholder_career_plus_inr',
    amount: 149900, currency: 'INR', monthly_credits: 300,
    features: { resumeUploads: 200, aiGrades: 300, coverLetters: 200 },
  },
];

export async function seedPlanCatalog(): Promise<void> {
  for (const plan of seedData) {
    await PlanCatalog.updateOne(
        { plan_id: plan.plan_id, region: plan.region },
        { $set: plan },
        { upsert: true }
    );
  }
  console.log(`Seeded ${seedData.length} plan_catalog rows`);
}

if (require.main === module) {
  (async () => {
    const dbUri = process.env.DB_URI;
    if (!dbUri) {
      console.error('DB_URI env var is required to run the seed script');
      process.exit(1);
    }
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    } as any);
    try {
      await seedPlanCatalog();
    } finally {
      await mongoose.connection.close();
    }
    process.exit(0);
  })().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
