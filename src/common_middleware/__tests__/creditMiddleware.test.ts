import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';

const mocks = vi.hoisted(() => ({
  tryDeduct: vi.fn(),
  recordConsumption: vi.fn(),
  recordRefund: vi.fn(),
  increment: vi.fn(),
}));

vi.mock('../../db/queries', () => ({
  userQueries: {
    tryDeductCreditBalance: mocks.tryDeduct,
    incrementCreditBalance: mocks.increment,
  },
  creditTransactionQueries: {
    recordConsumption: mocks.recordConsumption,
    recordRefund: mocks.recordRefund,
  },
}));

import {
  requireCredits,
  isInfraError,
  refundCreditsOnInfraError,
} from '../creditMiddleware';

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

describe('isInfraError', () => {
  it.each([
    ['OpenAI provider 503', true],
    ['ECONNRESET', true],
    ['socket hang up', true],
    ['Request timeout', true],
    ['Anthropic rate limit exceeded', true],
    ['Gemini network error', true],
    ['502 Bad Gateway', true],
    ['Validation failed: resume_id required', false],
    ['Extracted resume not found', false],
    ['unsupported file format', false],
  ])('%s => %s', (msg, expected) => {
    expect(isInfraError(new Error(msg))).toBe(expected);
  });

  it('treats non-Error values permissively (no infra match)', () => {
    expect(isInfraError(null)).toBe(false);
    expect(isInfraError(undefined)).toBe(false);
  });
});

describe('refundCreditsOnInfraError', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('refunds when infra error present and context attached', async () => {
    mocks.recordRefund.mockResolvedValue({});
    mocks.increment.mockResolvedValue(undefined);
    const res = {
      locals: {
        creditContext: {
          userId: 'u1', cost: 2, action: 'job_match', preJobId: 'job-123',
        },
      },
    } as any;
    await refundCreditsOnInfraError(res, new Error('OpenAI 503'));
    expect(mocks.recordRefund).toHaveBeenCalledWith('u1', 'job-123', 2);
    expect(mocks.increment).toHaveBeenCalledWith('u1', 2);
  });

  it('does NOT refund for user errors', async () => {
    const res = {
      locals: {
        creditContext: {
          userId: 'u1', cost: 2, action: 'job_match', preJobId: 'job-123',
        },
      },
    } as any;
    await refundCreditsOnInfraError(res, new Error('resume_id required'));
    expect(mocks.recordRefund).not.toHaveBeenCalled();
    expect(mocks.increment).not.toHaveBeenCalled();
  });

  it('no-ops when creditContext missing', async () => {
    const res = { locals: {} } as any;
    await refundCreditsOnInfraError(res, new Error('ECONNRESET'));
    expect(mocks.recordRefund).not.toHaveBeenCalled();
  });

  it('swallows downstream refund failures', async () => {
    mocks.recordRefund.mockRejectedValue(new Error('ledger down'));
    const res = {
      locals: {
        creditContext: {
          userId: 'u1', cost: 1, action: 'cover_letter', preJobId: 'job-xyz',
        },
      },
    } as any;
    await expect(
        refundCreditsOnInfraError(res, new Error('Gemini timeout'))
    ).resolves.toBeUndefined();
  });
});
