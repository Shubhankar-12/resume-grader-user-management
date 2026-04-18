import { describe, it, expect, vi } from 'vitest';
import { RazorpayProvider } from '../razorpay';

vi.mock('razorpay', () => ({
  default: vi.fn().mockImplementation(function () {
    return {
      subscriptions: { create: vi.fn().mockResolvedValue({ id: 'sub_abc', short_url: 'https://rzp.io/i/abc' }) },
    };
  }),
}));

describe('RazorpayProvider', () => {
  it('createCheckoutSession returns short_url as checkoutUrl', async () => {
    const provider = new RazorpayProvider('key_id', 'key_secret', 'webhook_secret');
    const result = await provider.createCheckoutSession({
      userId: 'u1', planId: 'PRO', providerPriceId: 'plan_rzp_pro',
      successUrl: 'https://x/success', cancelUrl: 'https://x/cancel',
      customerEmail: 'a@b.com',
    });
    expect(result.provider).toBe('razorpay');
    expect(result.checkoutUrl).toContain('rzp.io');
    expect(result.sessionId).toBe('sub_abc');
  });
});
