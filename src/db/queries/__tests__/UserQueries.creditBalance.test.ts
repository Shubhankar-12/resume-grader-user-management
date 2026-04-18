import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserQueries } from '../UserQueries';

describe('UserQueries credit-balance helpers', () => {
  let q: UserQueries;
  const mockFindOneAndUpdate = vi.fn();
  const mockUpdateOne = vi.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockModel: any = {
    findOneAndUpdate: mockFindOneAndUpdate,
    updateOne: mockUpdateOne,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    q = new UserQueries(mockModel);
  });

  it('incrementCreditBalance calls $inc', async () => {
    mockUpdateOne.mockResolvedValue({});
    await q.incrementCreditBalance('u1', 10);
    expect(mockUpdateOne).toHaveBeenCalledWith(
        { _id: 'u1' },
        { $inc: { credit_balance: 10 } },
    );
  });

  it('tryDeductCreditBalance returns true when sufficient', async () => {
    mockFindOneAndUpdate.mockResolvedValue({ _id: 'u1', credit_balance: 97 });
    expect(await q.tryDeductCreditBalance('u1', 3)).toBe(true);
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'u1', credit_balance: { $gte: 3 } },
        { $inc: { credit_balance: -3 } },
        { new: true },
    );
  });

  it('tryDeductCreditBalance returns false when insufficient', async () => {
    mockFindOneAndUpdate.mockResolvedValue(null);
    expect(await q.tryDeductCreditBalance('u1', 100)).toBe(false);
  });

  it('setCreditBalance uses $set', async () => {
    mockUpdateOne.mockResolvedValue({});
    await q.setCreditBalance('u1', 42);
    expect(mockUpdateOne).toHaveBeenCalledWith(
        { _id: 'u1' },
        { $set: { credit_balance: 42 } },
    );
  });
});
