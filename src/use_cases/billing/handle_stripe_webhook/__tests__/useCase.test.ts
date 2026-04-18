import { describe, it, expect, vi, beforeEach } from 'vitest';

// Test file path is src/use_cases/billing/handle_stripe_webhook/__tests__/ — 4 levels up to reach src/.
// Use vi.hoisted to avoid hoist-order errors.
const mocks = vi.hoisted(() => ({
  recordIfNew: vi.fn(),
  updateUser: vi.fn(),
  subscriptionCreate: vi.fn(),
  subscriptionUpdateOne: vi.fn(),
  subscriptionFindOne: vi.fn(),
  recordGrant: vi.fn(),
  incrementCreditBalance: vi.fn(),
  findPlan: vi.fn(),
  findPack: vi.fn(),
  findTransactionByReferenceId: vi.fn(),
}));

vi.mock('../../../../db/queries/WebhookEventQueries', () => ({
  webhookEventQueries: { recordIfNew: mocks.recordIfNew },
}));
vi.mock('../../../../db/queries', () => ({
  userQueries: {
    updateUser: mocks.updateUser,
    incrementCreditBalance: mocks.incrementCreditBalance,
  },
  creditTransactionQueries: { recordGrant: mocks.recordGrant },
  creditPackQueries: { findByPackAndRegion: mocks.findPack },
  planCatalogQueries: { findByPlanAndRegion: mocks.findPlan },
  webhookEventQueries: { recordIfNew: mocks.recordIfNew },
}));
vi.mock('../../../../db/payment_subscription', () => ({
  paymentSubscriptionModel: {
    create: mocks.subscriptionCreate,
    updateOne: mocks.subscriptionUpdateOne,
    findOne: mocks.subscriptionFindOne,
  },
}));
vi.mock('../../../../db/credit_transaction', () => ({
  creditTransactionModel: { findOne: mocks.findTransactionByReferenceId },
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
    // subscription.created should NOT grant credits — credits only grant on invoice.paid (subscription.renewed).
    expect(mocks.recordGrant).not.toHaveBeenCalled();
    expect(mocks.incrementCreditBalance).not.toHaveBeenCalled();
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

  it('grants monthly credits on subscription.renewed (invoice.paid)', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    mocks.subscriptionFindOne.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        user_id: 'u1',
        plan: 'PRO',
        region: 'GLOBAL',
      }),
    });
    mocks.findPlan.mockResolvedValue({ plan_id: 'PRO', region: 'GLOBAL', monthly_credits: 50 });

    const periodEndSec = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    const result = await handleStripeWebhookUseCase({
      eventType: 'subscription.renewed', providerEventId: 'evt_renew_1', provider: 'stripe',
      subscriptionId: 'sub_1', invoiceId: 'in_1',
      metadata: { userId: 'u1' },
      raw: { data: { object: { lines: { data: [{ period: { end: periodEndSec } }] } } } },
    });

    expect(result).toEqual({ processed: true });
    expect(mocks.subscriptionUpdateOne).toHaveBeenCalledWith(
      { provider_subscription_id: 'sub_1' },
      expect.objectContaining({ $set: expect.objectContaining({ status: 'ACTIVE' }) }),
    );
    expect(mocks.findPlan).toHaveBeenCalledWith('PRO', 'GLOBAL');
    expect(mocks.recordGrant).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u1',
      delta: 50,
      reason: 'subscription_grant',
      source: 'stripe',
      referenceId: 'in_1',
    }));
    expect(mocks.incrementCreditBalance).toHaveBeenCalledWith('u1', 50);
  });

  it('grants pack credits on pack.purchased', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    mocks.findPack.mockResolvedValue({ pack_id: 'PACK_25', region: 'GLOBAL', credits: 25 });

    const result = await handleStripeWebhookUseCase({
      eventType: 'pack.purchased', providerEventId: 'evt_pack_1', provider: 'stripe',
      customerId: 'cus_1',
      metadata: { userId: 'u1', packId: 'PACK_25' }, raw: {},
    });

    expect(result).toEqual({ processed: true });
    expect(mocks.findPack).toHaveBeenCalledWith('PACK_25', 'GLOBAL');
    expect(mocks.recordGrant).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u1',
      delta: 25,
      reason: 'purchase',
      source: 'stripe',
      referenceId: 'evt_pack_1',
      expiresOn: null,
    }));
    expect(mocks.incrementCreditBalance).toHaveBeenCalledWith('u1', 25);
    expect(mocks.updateUser).toHaveBeenCalledWith({ user_id: 'u1', stripe_customer_id: 'cus_1' });
  });

  it('reverses credits on refund.issued', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    mocks.findTransactionByReferenceId.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        user_id: 'u1',
        delta: 50,
      }),
    });

    const result = await handleStripeWebhookUseCase({
      eventType: 'refund.issued', providerEventId: 'evt_ref_1', provider: 'stripe',
      invoiceId: 'in_1', metadata: {}, raw: {},
    });

    expect(result).toEqual({ processed: true });
    expect(mocks.findTransactionByReferenceId).toHaveBeenCalledWith({ reference_id: 'in_1' });
    expect(mocks.recordGrant).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u1',
      delta: -50,
      reason: 'refund_external',
      source: 'stripe',
      referenceId: 'evt_ref_1:refund',
      expiresOn: null,
    }));
    expect(mocks.incrementCreditBalance).toHaveBeenCalledWith('u1', -50);
  });
});
