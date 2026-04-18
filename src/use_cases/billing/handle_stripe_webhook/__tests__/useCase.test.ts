import { describe, it, expect, vi, beforeEach } from 'vitest';

// Test file path is src/use_cases/billing/handle_stripe_webhook/__tests__/ — 4 levels up to reach src/.
// Use vi.hoisted to avoid hoist-order errors.
const mocks = vi.hoisted(() => ({
  recordIfNew: vi.fn(),
  updateUser: vi.fn(),
  subscriptionCreate: vi.fn(),
  subscriptionUpdateOne: vi.fn(),
}));

vi.mock('../../../../db/queries/WebhookEventQueries', () => ({
  webhookEventQueries: { recordIfNew: mocks.recordIfNew },
}));
vi.mock('../../../../db/queries', () => ({
  userQueries: { updateUser: mocks.updateUser },
}));
vi.mock('../../../../db/payment_subscription', () => ({
  paymentSubscriptionModel: {
    create: mocks.subscriptionCreate,
    updateOne: mocks.subscriptionUpdateOne,
  },
}));

import { handleStripeWebhookUseCase } from '../index';

describe('handleStripeWebhookUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('skips duplicate events', async () => {
    mocks.recordIfNew.mockResolvedValue(false);
    const result = await handleStripeWebhookUseCase({
      eventType: 'subscription.created', providerEventId: 'evt_1', provider: 'stripe',
      metadata: { userId: 'u1', planId: 'PRO' }, raw: {},
    });
    expect(result).toEqual({ skipped: true, reason: 'duplicate' });
    expect(mocks.subscriptionCreate).not.toHaveBeenCalled();
  });

  it('skips when no userId in metadata', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    const result = await handleStripeWebhookUseCase({
      eventType: 'subscription.created', providerEventId: 'evt_2', provider: 'stripe',
      metadata: {}, raw: {},
    });
    expect(result).toEqual({ skipped: true, reason: 'no userId in metadata' });
  });

  it('creates subscription on subscription.created', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    mocks.subscriptionCreate.mockResolvedValue({});
    const result = await handleStripeWebhookUseCase({
      eventType: 'subscription.created', providerEventId: 'evt_3', provider: 'stripe',
      subscriptionId: 'sub_1', customerId: 'cus_1',
      metadata: { userId: 'u1', planId: 'PRO' }, raw: {},
    });
    expect(result).toEqual({ processed: true });
    expect(mocks.subscriptionCreate).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'u1', provider: 'stripe', region: 'GLOBAL', currency: 'USD',
      provider_subscription_id: 'sub_1', stripe_customer_id: 'cus_1',
      plan: 'PRO', status: 'ACTIVE',
    }));
    expect(mocks.updateUser).toHaveBeenCalledWith({ user_id: 'u1', stripe_customer_id: 'cus_1' });
  });

  it('marks past_due on payment.failed', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    await handleStripeWebhookUseCase({
      eventType: 'payment.failed', providerEventId: 'evt_4', provider: 'stripe',
      subscriptionId: 'sub_1', metadata: { userId: 'u1' }, raw: {},
    });
    expect(mocks.subscriptionUpdateOne).toHaveBeenCalledWith(
      { provider_subscription_id: 'sub_1' },
      { $set: { status: 'PAST_DUE' } },
    );
  });

  it('marks cancelled on subscription.cancelled', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    await handleStripeWebhookUseCase({
      eventType: 'subscription.cancelled', providerEventId: 'evt_5', provider: 'stripe',
      subscriptionId: 'sub_1', metadata: { userId: 'u1' }, raw: {},
    });
    expect(mocks.subscriptionUpdateOne).toHaveBeenCalledWith(
      { provider_subscription_id: 'sub_1' },
      expect.objectContaining({ $set: expect.objectContaining({ status: 'CANCELLED' }) }),
    );
  });
});
