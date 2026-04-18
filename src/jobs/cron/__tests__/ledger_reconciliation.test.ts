import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  listAllUserIds: vi.fn(),
  getBalance: vi.fn(),
  getUserById: vi.fn(),
  setCreditBalance: vi.fn(),
  captureMessage: vi.fn(),
}));

vi.mock('../../../db/queries/CreditTransactionQueries', () => ({
  creditTransactionQueries: { getBalance: mocks.getBalance },
}));

vi.mock('../../../db/queries', () => ({
  userQueries: {
    listAllUserIds: mocks.listAllUserIds,
    getUserById: mocks.getUserById,
    setCreditBalance: mocks.setCreditBalance,
  },
}));

// Stub Sentry so captureMessage doesn't trigger real I/O during tests.
vi.mock('@sentry/node', () => ({
  captureMessage: mocks.captureMessage,
}));

import { reconcileLedgerDrift } from '../ledger_reconciliation';

describe('reconcileLedgerDrift', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns zero drift when all cached balances match the ledger', async () => {
    mocks.listAllUserIds.mockResolvedValue(['u1', 'u2']);
    mocks.getBalance.mockImplementation(async (uid: string) => (uid === 'u1' ? 10 : 0));
    mocks.getUserById.mockImplementation(async (uid: string) => [
      { _id: uid, credit_balance: uid === 'u1' ? 10 : 0 },
    ]);

    const result = await reconcileLedgerDrift();
    expect(result.checked).toBe(2);
    expect(result.driftCount).toBe(0);
    expect(result.driftedUsers).toEqual([]);
    expect(mocks.setCreditBalance).not.toHaveBeenCalled();
  });

  it('detects drift and corrects the cache to the ledger value', async () => {
    mocks.listAllUserIds.mockResolvedValue(['u1', 'u2', 'u3']);
    mocks.getBalance.mockImplementation(async (uid: string) => {
      if (uid === 'u1') return 10;
      if (uid === 'u2') return 5; // cache says 8 → drift
      return 0;
    });
    mocks.getUserById.mockImplementation(async (uid: string) => {
      if (uid === 'u1') return [{ _id: 'u1', credit_balance: 10 }];
      if (uid === 'u2') return [{ _id: 'u2', credit_balance: 8 }];
      return [{ _id: 'u3', credit_balance: 0 }];
    });
    mocks.setCreditBalance.mockResolvedValue(undefined);

    const result = await reconcileLedgerDrift();
    expect(result.checked).toBe(3);
    expect(result.driftCount).toBe(1);
    expect(result.driftedUsers).toEqual(['u2']);
    expect(mocks.setCreditBalance).toHaveBeenCalledTimes(1);
    expect(mocks.setCreditBalance).toHaveBeenCalledWith('u2', 5);
  });

  it('treats missing credit_balance as 0 and corrects it when ledger is non-zero', async () => {
    mocks.listAllUserIds.mockResolvedValue(['u1']);
    mocks.getBalance.mockResolvedValue(7);
    mocks.getUserById.mockResolvedValue([{ _id: 'u1' }]); // no credit_balance field
    mocks.setCreditBalance.mockResolvedValue(undefined);

    const result = await reconcileLedgerDrift();
    expect(result.driftCount).toBe(1);
    expect(mocks.setCreditBalance).toHaveBeenCalledWith('u1', 7);
  });

  it('skips users whose lookup returns empty', async () => {
    mocks.listAllUserIds.mockResolvedValue(['u_ghost']);
    mocks.getBalance.mockResolvedValue(0);
    mocks.getUserById.mockResolvedValue([]);

    const result = await reconcileLedgerDrift();
    expect(result.checked).toBe(1);
    expect(result.driftCount).toBe(0);
    expect(mocks.setCreditBalance).not.toHaveBeenCalled();
  });
});
