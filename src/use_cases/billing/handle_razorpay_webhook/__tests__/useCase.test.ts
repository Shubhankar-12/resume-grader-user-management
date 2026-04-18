import { describe, it, expect, vi, beforeEach } from 'vitest';

// Test file path is src/use_cases/billing/handle_razorpay_webhook/__tests__/ — 4 levels up to reach src/.
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

import { handleRazorpayWebhookUseCase } from '../index';

describe('handleRazorpayWebhookUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('skips duplicate events', async () => {
    mocks.recordIfNew.mockResolvedValue(false);
    const result = await handleRazorpayWebhookUseCase({
      eventType: 'subscription.created', providerEventId: 'evt_rzp_1', provider: 'razorpay',
      metadata: { userId: 'u1', planId: 'PRO_IN' }, raw: {},
    });
    expect(result).toEqual({ skipped: true, reason: 'duplicate' });
    expect(mocks.subscriptionCreate).not.toHaveBeenCalled();
  });

  it('skips when no userId in metadata', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    const result = await handleRazorpayWebhookUseCase({
      eventType: 'subscription.created', providerEventId: 'evt_rzp_2', provider: 'razorpay',
      metadata: {}, raw: {},
    });
    expect(result).toEqual({ skipped: true, reason: 'no userId in metadata' });
  });

  it('creates subscription row with razorpay/IN/INR on subscription.created', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    mocks.subscriptionCreate.mockResolvedValue({});
    const result = await handleRazorpayWebhookUseCase({
      eventType: 'subscription.created', providerEventId: 'evt_rzp_3', provider: 'razorpay',
      subscriptionId: 'sub_rzp_1', customerId: 'cust_rzp_1',
      metadata: { userId: 'u1', planId: 'PRO_IN' }, raw: {},
    });
    expect(result).toEqual({ processed: true });
    expect(mocks.subscriptionCreate).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'u1', provider: 'razorpay', region: 'IN', currency: 'INR',
      provider_subscription_id: 'sub_rzp_1', razorpay_customer_id: 'cust_rzp_1',
      plan: 'PRO_IN', status: 'ACTIVE',
    }));
    expect(mocks.updateUser).toHaveBeenCalledWith({ user_id: 'u1', razorpay_customer_id: 'cust_rzp_1' });
    // subscription.created must NOT grant credits — credits only grant on subscription.charged (renewed).
    expect(mocks.recordGrant).not.toHaveBeenCalled();
    expect(mocks.incrementCreditBalance).not.toHaveBeenCalled();
  });

  it('marks past_due on payment.failed', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    await handleRazorpayWebhookUseCase({
      eventType: 'payment.failed', providerEventId: 'evt_rzp_4', provider: 'razorpay',
      subscriptionId: 'sub_rzp_1', metadata: { userId: 'u1' }, raw: {},
    });
    expect(mocks.subscriptionUpdateOne).toHaveBeenCalledWith(
        { provider_subscription_id: 'sub_rzp_1' },
        { $set: { status: 'PAST_DUE' } },
    );
  });

  it('marks cancelled on subscription.cancelled', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    await handleRazorpayWebhookUseCase({
      eventType: 'subscription.cancelled', providerEventId: 'evt_rzp_5', provider: 'razorpay',
      subscriptionId: 'sub_rzp_1', metadata: { userId: 'u1' }, raw: {},
    });
    expect(mocks.subscriptionUpdateOne).toHaveBeenCalledWith(
        { provider_subscription_id: 'sub_rzp_1' },
        expect.objectContaining({ $set: expect.objectContaining({ status: 'CANCELLED' }) }),
    );
  });

  it('grants monthly credits on subscription.renewed (subscription.charged)', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    mocks.subscriptionFindOne.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        user_id: 'u1',
        plan: 'PRO_IN',
        region: 'IN',
      }),
    });
    mocks.findPlan.mockResolvedValue({ plan_id: 'PRO_IN', region: 'IN', monthly_credits: 50 });

    const currentEndSec = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    const result = await handleRazorpayWebhookUseCase({
      eventType: 'subscription.renewed', providerEventId: 'evt_rzp_renew_1', provider: 'razorpay',
      subscriptionId: 'sub_rzp_1', invoiceId: 'pay_rzp_1',
      metadata: { userId: 'u1' },
      raw: { payload: { subscription: { entity: { current_end: currentEndSec } } } },
    });

    expect(result).toEqual({ processed: true });
    expect(mocks.subscriptionUpdateOne).toHaveBeenCalledWith(
        { provider_subscription_id: 'sub_rzp_1' },
        expect.objectContaining({ $set: expect.objectContaining({ status: 'ACTIVE' }) }),
    );
    expect(mocks.findPlan).toHaveBeenCalledWith('PRO_IN', 'IN');
    expect(mocks.recordGrant).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u1',
      delta: 50,
      reason: 'subscription_grant',
      source: 'razorpay',
      referenceId: 'pay_rzp_1',
    }));
    expect(mocks.incrementCreditBalance).toHaveBeenCalledWith('u1', 50);
  });

  it('grants pack credits on pack.purchased with region=IN', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    mocks.findPack.mockResolvedValue({ pack_id: 'PACK_25', region: 'IN', credits: 25 });

    const result = await handleRazorpayWebhookUseCase({
      eventType: 'pack.purchased', providerEventId: 'evt_rzp_pack_1', provider: 'razorpay',
      customerId: 'cust_rzp_1',
      metadata: { userId: 'u1', packId: 'PACK_25' }, raw: {},
    });

    expect(result).toEqual({ processed: true });
    expect(mocks.findPack).toHaveBeenCalledWith('PACK_25', 'IN');
    expect(mocks.recordGrant).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u1',
      delta: 25,
      reason: 'purchase',
      source: 'razorpay',
      referenceId: 'evt_rzp_pack_1',
      expiresOn: null,
    }));
    expect(mocks.incrementCreditBalance).toHaveBeenCalledWith('u1', 25);
    expect(mocks.updateUser).toHaveBeenCalledWith({ user_id: 'u1', razorpay_customer_id: 'cust_rzp_1' });
  });

  it('reverses credits on refund.issued', async () => {
    mocks.recordIfNew.mockResolvedValue(true);
    mocks.findTransactionByReferenceId.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        user_id: 'u1',
        delta: 25,
      }),
    });

    const result = await handleRazorpayWebhookUseCase({
      eventType: 'refund.issued', providerEventId: 'evt_rzp_ref_1', provider: 'razorpay',
      invoiceId: 'pay_rzp_1', metadata: {}, raw: {},
    });

    expect(result).toEqual({ processed: true });
    expect(mocks.findTransactionByReferenceId).toHaveBeenCalledWith({ reference_id: 'pay_rzp_1' });
    expect(mocks.recordGrant).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u1',
      delta: -25,
      reason: 'refund_external',
      source: 'razorpay',
      referenceId: 'evt_rzp_ref_1:refund',
      expiresOn: null,
    }));
    expect(mocks.incrementCreditBalance).toHaveBeenCalledWith('u1', -25);
  });
});
