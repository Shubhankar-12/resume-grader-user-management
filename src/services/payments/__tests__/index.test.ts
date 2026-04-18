import { describe, it, expect, beforeEach } from 'vitest';
import { getPaymentProvider } from '../index';
import { StripeProvider } from '../stripe';
import { RazorpayProvider } from '../razorpay';

describe('getPaymentProvider', () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_xxx';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_xxx';
    process.env.RAZORPAY_KEY_ID = 'rzp_xxx';
    process.env.RAZORPAY_KEY_SECRET = 'rzp_secret';
    process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_rzp';
  });

  it('returns StripeProvider for GLOBAL region', () => {
    expect(getPaymentProvider('GLOBAL')).toBeInstanceOf(StripeProvider);
  });
  it('returns RazorpayProvider for IN region', () => {
    expect(getPaymentProvider('IN')).toBeInstanceOf(RazorpayProvider);
  });
});
