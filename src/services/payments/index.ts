import type { PaymentProvider, Region } from './types';
import { StripeProvider } from './stripe';
import { RazorpayProvider } from './razorpay';

export function getPaymentProvider(region: Region): PaymentProvider {
  if (region === 'IN') {
    return new RazorpayProvider(
      requireEnv('RAZORPAY_KEY_ID'),
      requireEnv('RAZORPAY_KEY_SECRET'),
      requireEnv('RAZORPAY_WEBHOOK_SECRET'),
    );
  }
  return new StripeProvider(
    requireEnv('STRIPE_SECRET_KEY'),
    requireEnv('STRIPE_WEBHOOK_SECRET'),
  );
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export * from './types';
