import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockGetUserById,
  mockFindByPackAndRegion,
  mockProviderCheckout,
} = vi.hoisted(() => ({
  mockGetUserById: vi.fn(),
  mockFindByPackAndRegion: vi.fn(),
  mockProviderCheckout: vi.fn(),
}));

vi.mock('../../../../db/queries/UserQueries', () => ({
  UserQueries: vi.fn().mockImplementation(function () {
    return { getUserById: mockGetUserById };
  }),
}));
vi.mock('../../../../db/queries/CreditPackQueries', () => ({
  creditPackQueries: { findByPackAndRegion: mockFindByPackAndRegion },
}));
vi.mock('../../../../db/user', () => ({
  userModel: {},
}));
vi.mock('../../../../services/payments', () => ({
  getPaymentProvider: () => ({ createCheckoutSession: mockProviderCheckout }),
}));

import { purchaseCreditsUseCase } from '../index';

describe('purchaseCreditsUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns checkout URL for a user with matching currency', async () => {
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

  it('FREE user with no active subscription can purchase a pack', async () => {
    mockGetUserById.mockResolvedValue({
      _id: 'u1', email: 'a@b.com', region: 'IN', currency: 'INR',
    });
    mockFindByPackAndRegion.mockResolvedValue({
      pack_id: 'PACK_10', region: 'IN', provider: 'razorpay',
      provider_price_id: null, amount: 9900, currency: 'INR',
    });
    mockProviderCheckout.mockResolvedValue({
      sessionId: 'order_abc', provider: 'razorpay',
      razorpayOrderId: 'order_abc', razorpayKeyId: 'key_id_123',
      amount: 9900, currency: 'INR',
    });

    const result = await purchaseCreditsUseCase({
      userId: 'u1',
      packId: 'PACK_10',
      requestedCurrency: 'INR',
      detectedRegion: 'IN',
    });

    expect(result.provider).toBe('razorpay');
    expect(result.razorpayOrderId).toBe('order_abc');
    expect(mockProviderCheckout).toHaveBeenCalled();
  });

  it('throws currency lock error when user currency differs from request', async () => {
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
    mockGetUserById.mockResolvedValue([{
      _id: 'u1', email: 'a@b.com', region: 'IN', currency: 'INR', razorpay_customer_id: 'cust_rzp',
    }]);
    mockFindByPackAndRegion.mockResolvedValue({
      pack_id: 'PACK_10', region: 'IN', provider: 'razorpay',
      provider_price_id: null, amount: 9900, currency: 'INR',
    });
    mockProviderCheckout.mockResolvedValue({
      sessionId: 'ord_1', provider: 'razorpay',
      razorpayOrderId: 'ord_1', razorpayKeyId: 'key_id_123',
      amount: 9900, currency: 'INR',
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
      amount: 9900,
      currency: 'INR',
      mode: 'payment',
    }));
  });
});
