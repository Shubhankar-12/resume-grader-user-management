import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  transactionFind: vi.fn(),
  expirySeenCreate: vi.fn(),
  getBalance: vi.fn(),
  setCreditBalance: vi.fn(),
}));

vi.mock('../../../db/credit_transaction', () => ({
  creditTransactionModel: { find: mocks.transactionFind },
}));

vi.mock('../../../db/queries/CreditTransactionQueries', () => ({
  creditTransactionQueries: { getBalance: mocks.getBalance },
}));

vi.mock('../../../db/queries', () => ({
  userQueries: { setCreditBalance: mocks.setCreditBalance },
}));

// Mock mongoose.model so the ExpirySeenModel creation in the module under test
// returns our mock. Preserve Schema and other named exports from the real
// module — mongoose 5 attaches them as own props on the default export.
vi.mock('mongoose', async () => {
  const actual: any = await vi.importActual<any>('mongoose');
  const overridden = {
    Schema: actual.Schema,
    Types: actual.Types,
    model: (name: string, _schema: any, _col: any) => {
      if (name === 'CreditExpirySeen') {
        return { create: mocks.expirySeenCreate };
      }
      return actual.model(name, _schema, _col);
    },
  };
  return {
    ...actual,
    ...overridden,
    default: { ...actual, ...overridden },
  };
});

import { sweepMonthlyExpiry } from '../monthly_expiry_sweeper';

describe('sweepMonthlyExpiry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reconciles cache for users with newly expired grants', async () => {
    mocks.transactionFind.mockReturnValue({
      lean: () => Promise.resolve([
        { user_id: 'u1', reference_id: 'in_1', delta: 100 },
        { user_id: 'u1', reference_id: 'in_2', delta: 100 },
        { user_id: 'u2', reference_id: 'in_3', delta: 50 },
      ]),
    });
    mocks.expirySeenCreate.mockResolvedValue({});
    mocks.getBalance.mockImplementation(async (uid: string) => (uid === 'u1' ? 40 : 10));
    mocks.setCreditBalance.mockResolvedValue(undefined);

    const result = await sweepMonthlyExpiry();
    expect(result.affectedUserCount).toBe(2);
    expect(result.expiredGrantCount).toBe(3);
    expect(mocks.setCreditBalance).toHaveBeenCalledWith('u1', 40);
    expect(mocks.setCreditBalance).toHaveBeenCalledWith('u2', 10);
  });

  it('skips grants already marked seen (duplicate key)', async () => {
    mocks.transactionFind.mockReturnValue({
      lean: () => Promise.resolve([{ user_id: 'u1', reference_id: 'in_1', delta: 100 }]),
    });
    const dupErr: any = new Error('duplicate');
    dupErr.code = 11000;
    mocks.expirySeenCreate.mockRejectedValue(dupErr);

    const result = await sweepMonthlyExpiry();
    expect(result.affectedUserCount).toBe(0);
    expect(result.expiredGrantCount).toBe(0);
    expect(mocks.setCreditBalance).not.toHaveBeenCalled();
  });
});
