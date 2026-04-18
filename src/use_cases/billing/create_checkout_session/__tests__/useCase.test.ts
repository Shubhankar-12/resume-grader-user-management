import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetUserById, mockFindByPlanAndRegion, mockProviderCheckout } = vi.hoisted(() => ({
  mockGetUserById: vi.fn(),
  mockFindByPlanAndRegion: vi.fn(),
  mockProviderCheckout: vi.fn(),
}));

vi.mock('../../../../db/queries/UserQueries', () => ({
  UserQueries: vi.fn().mockImplementation(function () {
    return { getUserById: mockGetUserById };
  }),
}));
vi.mock('../../../../db/queries/PlanCatalogQueries', () => ({
  planCatalogQueries: { findByPlanAndRegion: mockFindByPlanAndRegion },
}));
vi.mock('../../../../services/payments', () => ({
  getPaymentProvider: () => ({ createCheckoutSession: mockProviderCheckout }),
}));

import { createCheckoutSessionUseCase } from '../index';

describe('createCheckoutSessionUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('locks user region on first checkout and returns checkout URL', async () => {
    mockGetUserById.mockResolvedValue({ _id: 'u1', email: 'a@b.com', region: null, currency: null });
    mockFindByPlanAndRegion.mockResolvedValue({
      plan_id: 'PRO', region: 'GLOBAL', provider: 'stripe',
      provider_price_id: 'price_pro',
    });
    mockProviderCheckout.mockResolvedValue({
      checkoutUrl: 'https://x', sessionId: 'cs_1', provider: 'stripe',
    });

    const updateSpy = vi.fn();
    const result = await createCheckoutSessionUseCase({
      userId: 'u1',
      planId: 'PRO',
      requestedCurrency: 'USD',
      detectedRegion: 'GLOBAL',
      updateUserRegion: updateSpy,
    });

    expect(updateSpy).toHaveBeenCalledWith('u1', 'GLOBAL', 'USD');
    expect(mockFindByPlanAndRegion).toHaveBeenCalledWith('PRO', 'GLOBAL');
    expect(mockProviderCheckout).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u1',
      planId: 'PRO',
      providerPriceId: 'price_pro',
      customerEmail: 'a@b.com',
    }));
    expect(result.checkoutUrl).toBe('https://x');
  });

  it('rejects currency mismatch for already-locked user', async () => {
    mockGetUserById.mockResolvedValue({ _id: 'u1', region: 'IN', currency: 'INR' });

    await expect(createCheckoutSessionUseCase({
      userId: 'u1',
      planId: 'PRO',
      requestedCurrency: 'USD',
      detectedRegion: 'GLOBAL',
      updateUserRegion: vi.fn(),
    })).rejects.toThrow(/currency lock/i);
  });

  it('throws when plan not found for region', async () => {
    mockGetUserById.mockResolvedValue({ _id: 'u1', region: 'GLOBAL', currency: 'USD', email: 'a@b.com' });
    mockFindByPlanAndRegion.mockResolvedValue(null);

    await expect(createCheckoutSessionUseCase({
      userId: 'u1',
      planId: 'CAREER_PLUS',
      requestedCurrency: 'USD',
      detectedRegion: 'GLOBAL',
      updateUserRegion: vi.fn(),
    })).rejects.toThrow(/No plan found/i);
  });

  it('handles getUserById returning an array', async () => {
    mockGetUserById.mockResolvedValue([{ _id: 'u1', email: 'a@b.com', region: 'GLOBAL', currency: 'USD' }]);
    mockFindByPlanAndRegion.mockResolvedValue({ plan_id: 'PRO', region: 'GLOBAL', provider: 'stripe', provider_price_id: 'price_pro' });
    mockProviderCheckout.mockResolvedValue({ checkoutUrl: 'https://x', sessionId: 'cs_1', provider: 'stripe' });

    const result = await createCheckoutSessionUseCase({
      userId: 'u1', planId: 'PRO', requestedCurrency: 'USD', detectedRegion: 'GLOBAL',
      updateUserRegion: vi.fn(),
    });
    expect(result.checkoutUrl).toBe('https://x');
  });
});
