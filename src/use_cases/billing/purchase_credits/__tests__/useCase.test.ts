import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockGetUserById,
  mockFindByPackAndRegion,
  mockProviderCheckout,
  mockSubFindOne,
} = vi.hoisted(() => ({
  mockGetUserById: vi.fn(),
  mockFindByPackAndRegion: vi.fn(),
  mockProviderCheckout: vi.fn(),
  mockSubFindOne: vi.fn(),
}));

vi.mock('../../../../db/queries/UserQueries', () => ({
  UserQueries: vi.fn().mockImplementation(function () {
    return { getUserById: mockGetUserById };
  }),
}));
vi.mock('../../../../db/queries/CreditPackQueries', () => ({
  creditPackQueries: { findByPackAndRegion: mockFindByPackAndRegion },
}));
vi.mock('../../../../db/payment_subscription', () => ({
  paymentSubscriptionModel: {
    findOne: (...args: unknown[]) => mockSubFindOne(...args),
  },
}));
vi.mock('../../../../db/user', () => ({
  userModel: {},
}));
vi.mock('../../../../services/payments', () => ({
  getPaymentProvider: () => ({ createCheckoutSession: mockProviderCheckout }),
}));

import { purchaseCreditsUseCase } from '../index';

function mockActiveSub() {
  mockSubFindOne.mockReturnValue({ lean: () => Promise.resolve({ _id: 's1', status: 'ACTIVE' }) });
}
function mockNoActiveSub() {
  mockSubFindOne.mockReturnValue({ lean: () => Promise.resolve(null) });
}

describe('purchaseCreditsUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns checkout URL for active subscriber with matching currency', async () => {
    mockActiveSub();
    mockGetUserById.mockResolvedValue({
      _id: 'u1', email: 'a@b.com', region: 'GLOBAL', currency: 'USD', stripe_customer_id: 'cus_1',
    });
    mockFindByPackAndRegion.mockResolvedValue({
      pack_id: 'PACK_25', region: 'GLOBAL', provider: 'stripe',
      provider_price_id: 'price_pack_25', amount: 1500, currency: 'USD',
    });
    mockProviderCheckout.mockResolvedValue({
      checkoutUrl: 'https://checkout.example/x', sessionId: 'cs_1', provider: 'stripe',
    });

    const result = await purchaseCreditsUseCase({
      userId: 'u1',
      packId: 'PACK_25',
      requestedCurrency: 'USD',
      detectedRegion: 'GLOBAL',
    });

    expect(mockFindByPackAndRegion).toHaveBeenCalledWith('PACK_25', 'GLOBAL');
    expect(mockProviderCheckout).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u1',
      planId: 'PACK_25',
      providerPriceId: 'price_pack_25',
      mode: 'payment',
      amount: 1500,
      currency: 'USD',
      customerEmail: 'a@b.com',
      existingCustomerId: 'cus_1',
      metadata: { packId: 'PACK_25', userId: 'u1' },
    }));
    expect(result.checkoutUrl).toBe('https://checkout.example/x');
  });

  it('throws SUBSCRIPTION_REQUIRED when no active subscription', async () => {
    mockNoActiveSub();

    await expect(purchaseCreditsUseCase({
      userId: 'u1',
      packId: 'PACK_25',
      requestedCurrency: 'USD',
      detectedRegion: 'GLOBAL',
    })).rejects.toThrow('SUBSCRIPTION_REQUIRED');

    expect(mockGetUserById).not.toHaveBeenCalled();
    expect(mockProviderCheckout).not.toHaveBeenCalled();
  });

  it('throws currency lock error when user currency differs from request', async () => {
    mockActiveSub();
    mockGetUserById.mockResolvedValue({
      _id: 'u1', email: 'a@b.com', region: 'IN', currency: 'INR',
    });

    await expect(purchaseCreditsUseCase({
      userId: 'u1',
      packId: 'PACK_25',
      requestedCurrency: 'USD',
      detectedRegion: 'GLOBAL',
    })).rejects.toThrow(/currency lock/i);
  });

  it('throws when pack not found for region', async () => {
    mockActiveSub();
    mockGetUserById.mockResolvedValue({
      _id: 'u1', email: 'a@b.com', region: 'GLOBAL', currency: 'USD',
    });
    mockFindByPackAndRegion.mockResolvedValue(null);

    await expect(purchaseCreditsUseCase({
      userId: 'u1',
      packId: 'PACK_60',
      requestedCurrency: 'USD',
      detectedRegion: 'GLOBAL',
    })).rejects.toThrow(/No pack found/i);
  });

  it('handles getUserById returning an array (aggregate-style)', async () => {
    mockActiveSub();
    mockGetUserById.mockResolvedValue([{
      _id: 'u1', email: 'a@b.com', region: 'IN', currency: 'INR', razorpay_customer_id: 'cust_rzp',
    }]);
    mockFindByPackAndRegion.mockResolvedValue({
      pack_id: 'PACK_10', region: 'IN', provider: 'razorpay',
      provider_price_id: null, amount: 19900, currency: 'INR',
    });
    mockProviderCheckout.mockResolvedValue({
      checkoutUrl: 'https://api.razorpay.com/v1/checkout/embedded?order_id=ord_1',
      sessionId: 'ord_1', provider: 'razorpay',
    });

    const result = await purchaseCreditsUseCase({
      userId: 'u1',
      packId: 'PACK_10',
      requestedCurrency: 'INR',
      detectedRegion: 'IN',
    });

    expect(result.sessionId).toBe('ord_1');
    expect(mockProviderCheckout).toHaveBeenCalledWith(expect.objectContaining({
      existingCustomerId: 'cust_rzp',
      providerPriceId: null,
      amount: 19900,
      currency: 'INR',
      mode: 'payment',
    }));
  });
});
