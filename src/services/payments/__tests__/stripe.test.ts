import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StripeProvider } from '../stripe';

const mockCreate = vi.fn();
const mockConstructEvent = vi.fn();

vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(function () {
      return {
        checkout: { sessions: { create: mockCreate } },
        webhooks: { constructEvent: mockConstructEvent },
        subscriptions: { cancel: vi.fn().mockResolvedValue({}) },
      };
    }),
  };
});

describe('StripeProvider', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('createCheckoutSession returns checkoutUrl + sessionId', async () => {
    mockCreate.mockResolvedValue({ id: 'cs_test_123', url: 'https://checkout.stripe.com/c/cs_test_123' });
    const provider = new StripeProvider('sk_test_xxx', 'whsec_xxx');
    const result = await provider.createCheckoutSession({
      userId: 'u1', planId: 'PRO', providerPriceId: 'price_pro',
      successUrl: 'https://x/success', cancelUrl: 'https://x/cancel',
      customerEmail: 'a@b.com',
    });
    expect(result).toEqual({
      checkoutUrl: 'https://checkout.stripe.com/c/cs_test_123',
      sessionId: 'cs_test_123',
      provider: 'stripe',
    });
  });

  it('verifyWebhook normalizes invoice.paid event', () => {
    mockConstructEvent.mockReturnValue({
      id: 'evt_1', type: 'invoice.paid',
      data: { object: { id: 'in_1', subscription: 'sub_1', customer: 'cus_1' } },
    });
    const provider = new StripeProvider('sk_test_xxx', 'whsec_xxx');
    const event = provider.verifyWebhook(Buffer.from('{}'), 'sig');
    expect(event.eventType).toBe('subscription.renewed');
    expect(event.providerEventId).toBe('evt_1');
    expect(event.subscriptionId).toBe('sub_1');
    expect(event.invoiceId).toBe('in_1');
  });

  it('verifyWebhook throws on invalid signature', () => {
    mockConstructEvent.mockImplementation(() => { throw new Error('Invalid signature'); });
    const provider = new StripeProvider('sk_test_xxx', 'whsec_xxx');
    expect(() => provider.verifyWebhook(Buffer.from('{}'), 'bad')).toThrow('Invalid signature');
  });
});
