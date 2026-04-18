import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';

const mocks = vi.hoisted(() => ({
  tryDeduct: vi.fn(),
  recordConsumption: vi.fn(),
  increment: vi.fn(),
}));

vi.mock('../../db/queries', () => ({
  userQueries: {
    tryDeductCreditBalance: mocks.tryDeduct,
    incrementCreditBalance: mocks.increment,
  },
  creditTransactionQueries: { recordConsumption: mocks.recordConsumption },
}));

import { requireCredits } from '../creditMiddleware';

function makeReqRes(userId = 'u1') {
  return {
    req: {} as any,
    res: {
      locals: userId ? { auth: { decoded_token: { user: { id: userId } } } } : {},
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any,
    next: vi.fn(),
  };
}

describe('requireCredits middleware', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('allows request when balance sufficient', async () => {
    mocks.tryDeduct.mockResolvedValue(true);
    mocks.recordConsumption.mockResolvedValue({});
    const mw = requireCredits('resume_grade');
    const { req, res, next } = makeReqRes();
    await mw(req, res, next);
    expect(mocks.tryDeduct).toHaveBeenCalledWith('u1', 3);
    expect(mocks.recordConsumption).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u1', cost: 3, action: 'resume_grade', jobId: expect.any(String),
    }));
    expect(next).toHaveBeenCalled();
    expect((res.locals as any).creditContext).toMatchObject({
      preJobId: expect.any(String), cost: 3, action: 'resume_grade', userId: 'u1',
    });
  });

  it('returns 402 when balance insufficient', async () => {
    mocks.tryDeduct.mockResolvedValue(false);
    const mw = requireCredits('cover_letter');
    const { req, res, next } = makeReqRes();
    await mw(req, res, next);
    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'INSUFFICIENT_CREDITS',
      creditsNeeded: 1,
    }));
    expect(next).not.toHaveBeenCalled();
    expect(mocks.recordConsumption).not.toHaveBeenCalled();
  });

  it('returns 401 when user not authenticated', async () => {
    const mw = requireCredits('resume_grade');
    const { req, res, next } = makeReqRes('');
    await mw(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rolls back cache when ledger write fails', async () => {
    mocks.tryDeduct.mockResolvedValue(true);
    mocks.recordConsumption.mockRejectedValue(new Error('db down'));
    mocks.increment.mockResolvedValue(undefined);
    const mw = requireCredits('tailored_resume');
    const { req, res, next } = makeReqRes();
    await mw(req, res, next);
    expect(mocks.increment).toHaveBeenCalledWith('u1', 2);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'CREDIT_LEDGER_ERROR' }));
    expect(next).not.toHaveBeenCalled();
  });
});
