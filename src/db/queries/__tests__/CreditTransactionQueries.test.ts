import { describe, it, expect, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  aggregate: vi.fn(),
  findOne: vi.fn(),
}));

vi.mock('../../credit_transaction', () => ({
  creditTransactionModel: {
    create: mocks.create,
    aggregate: mocks.aggregate,
    findOne: mocks.findOne,
  },
}));

import { creditTransactionQueries } from '../CreditTransactionQueries';

describe('CreditTransactionQueries', () => {
  it('recordGrant writes with expiresOn when provided', async () => {
    mocks.create.mockResolvedValue({ _id: 'tx1' });
    const expires = new Date('2026-05-18');
    await creditTransactionQueries.recordGrant({
      userId: 'u1',
      delta: 100,
      reason: 'subscription_grant',
      source: 'stripe',
      referenceId: 'in_1',
      expiresOn: expires,
    });
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'u1',
      delta: 100,
      reason: 'subscription_grant',
      expires_on: expires,
      reference_id: 'in_1',
    }));
  });

  it('recordConsumption writes negative delta', async () => {
    mocks.create.mockResolvedValue({});
    await creditTransactionQueries.recordConsumption({
      userId: 'u1',
      cost: 3,
      action: 'resume_grade',
      jobId: 'job_1',
    });
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'u1',
      delta: -3,
      reason: 'consumption',
      reference_id: 'job_1',
    }));
  });

  it('recordRefund writes positive delta', async () => {
    mocks.create.mockResolvedValue({});
    await creditTransactionQueries.recordRefund('u1', 'job_1', 3);
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'u1',
      delta: 3,
      reason: 'refund',
      reference_id: 'job_1:refund',
    }));
  });

  it('getBalance sums non-expired entries', async () => {
    mocks.aggregate.mockResolvedValue([{ _id: null, total: 42 }]);
    const balance = await creditTransactionQueries.getBalance('u1');
    expect(balance).toBe(42);
    const pipeline = mocks.aggregate.mock.calls[0][0];
    expect(pipeline[0]).toHaveProperty('$match.user_id');
  });

  it('getBalance returns 0 when no transactions', async () => {
    mocks.aggregate.mockResolvedValue([]);
    const balance = await creditTransactionQueries.getBalance('u1');
    expect(balance).toBe(0);
  });
});
