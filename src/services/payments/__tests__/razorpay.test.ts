import { describe, it, expect, vi } from 'vitest';
import crypto from 'crypto';
import { RazorpayProvider } from '../razorpay';

vi.mock('razorpay', () => ({
  default: vi.fn().mockImplementation(function () {
    return {
      subscriptions: { create: vi.fn().mockResolvedValue({ id: 'sub_abc', short_url: 'https://rzp.io/i/abc' }) },
      orders: { create: vi.fn().mockResolvedValue({ id: 'order_abc' }) },
    };
  }),
}));

function signedBody(event: any, secret: string): { rawBody: Buffer; sig: string } {
  const rawBody = Buffer.from(JSON.stringify(event));
  const sig = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return { rawBody, sig };
}

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

  it('verifyWebhook normalizes order.paid (pack purchase)', () => {
    const event = {
      event: 'order.paid',
      payload: {
        order: { entity: { id: 'order_1', notes: { userId: 'u1', packId: 'PACK_25' } } },
        payment: { entity: { id: 'pay_1', customer_id: 'cust_1' } },
      },
    };
    const { rawBody, sig } = signedBody(event, 'webhook_secret');
    const provider = new RazorpayProvider('key_id', 'key_secret', 'webhook_secret');
    const normalized = provider.verifyWebhook(rawBody, sig);
    expect(normalized.eventType).toBe('pack.purchased');
    expect(normalized.metadata.userId).toBe('u1');
    expect(normalized.metadata.packId).toBe('PACK_25');
    expect(normalized.customerId).toBe('cust_1');
  });

  it('verifyWebhook normalizes payment.refunded', () => {
    const event = {
      event: 'payment.refunded',
      payload: {
        refund: { entity: { id: 'rfnd_1' } },
        payment: { entity: { id: 'pay_1', customer_id: 'cust_1' } },
      },
    };
    const { rawBody, sig } = signedBody(event, 'webhook_secret');
    const provider = new RazorpayProvider('key_id', 'key_secret', 'webhook_secret');
    const normalized = provider.verifyWebhook(rawBody, sig);
    expect(normalized.eventType).toBe('refund.issued');
    expect(normalized.invoiceId).toBe('pay_1');
  });

  it('verifyWebhook throws on signature mismatch', () => {
    const event = { event: 'order.paid', payload: { order: { entity: { id: 'order_1', notes: {} } }, payment: { entity: {} } } };
    const rawBody = Buffer.from(JSON.stringify(event));
    const provider = new RazorpayProvider('key_id', 'key_secret', 'webhook_secret');
    expect(() => provider.verifyWebhook(rawBody, 'bad_signature')).toThrow(/signature mismatch/i);
  });

  it('verifyWebhook normalizes subscription.charged as subscription.renewed', () => {
    const event = {
      event: 'subscription.charged',
      payload: {
        subscription: {
          entity: {
            id: 'sub_1',
            customer_id: 'cust_1',
            notes: { userId: 'u1', planId: 'PRO_IN' },
            current_end: 1800000000,
          },
        },
        payment: { entity: { id: 'pay_1' } },
      },
    };
    const { rawBody, sig } = signedBody(event, 'webhook_secret');
    const provider = new RazorpayProvider('key_id', 'key_secret', 'webhook_secret');
    const normalized = provider.verifyWebhook(rawBody, sig);
    expect(normalized.eventType).toBe('subscription.renewed');
    expect(normalized.subscriptionId).toBe('sub_1');
    expect(normalized.invoiceId).toBe('pay_1');
    expect(normalized.metadata.userId).toBe('u1');
  });

  it('createCheckoutSession payment mode returns razorpay order id + key + amount', async () => {
    const provider = new RazorpayProvider('key_id_123', 'key_secret', 'webhook_secret');
    const result = await provider.createCheckoutSession({
      userId: 'u1',
      planId: 'PACK_10',
      providerPriceId: null,
      mode: 'payment',
      amount: 9900,
      currency: 'INR',
      successUrl: 'https://x/success',
      cancelUrl: 'https://x/cancel',
      customerEmail: 'a@b.com',
      metadata: { packId: 'PACK_10', userId: 'u1' },
    });
    expect(result.provider).toBe('razorpay');
    expect(result.sessionId).toBe('order_abc');
    expect(result.razorpayOrderId).toBe('order_abc');
    expect(result.razorpayKeyId).toBe('key_id_123');
    expect(result.amount).toBe(9900);
    expect(result.currency).toBe('INR');
    expect(result.checkoutUrl).toBeUndefined();
  });
});
