import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import {
  Request, Response, NextFunction,
} from 'express';

// Mock dependencies before importing the module under test
vi.mock('jsonwebtoken', () => ({ default: { verify: vi.fn() } }));

vi.mock('../../db/queries', () => ({
  userQueries: {
    getUserById: vi.fn(),
    updateUserUsage: vi.fn(),
  },
  paymentSubscriptionQueries: { getUserCurrentSubscription: vi.fn() },
}));

vi.mock('../../helpers/constants/constant', () => ({
  planLimits: {
    FREE: {
      resumeUploads: 1,
      tailoredResumes: 1,
      coverLetters: 1,
      githubAnalyses: 0,
    },
    BASIC: {
      resumeUploads: 3,
      tailoredResumes: 3,
      coverLetters: 3,
      githubAnalyses: 3,
    },
    PRO: {
      resumeUploads: Infinity,
      tailoredResumes: Infinity,
      coverLetters: Infinity,
      githubAnalyses: Infinity,
    },
  },
}));

import jwt from 'jsonwebtoken';
import {
  userQueries, paymentSubscriptionQueries,
} from '../../db/queries';
import { PlanLimitChecker } from '../planMiddleware';

function createMockReqResNext() {
  const req = { headers: { authorization: 'Bearer valid-token' } } as unknown as Request;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;

  const next = vi.fn() as NextFunction;

  return {
    req,
    res,
    next,
  };
}

describe('PlanLimitChecker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CUSTOMER_POLICY_JWT_KEY = 'test-secret';
  });

  it('should pass for FREE user with 0 usage', async () => {
    const {
      req, res, next,
    } = createMockReqResNext();

    vi.mocked(jwt.verify).mockReturnValue({ user: { id: 'user-1' } } as any);
    vi.mocked(paymentSubscriptionQueries.getUserCurrentSubscription).mockResolvedValue(
      { plan: 'FREE' } as any
    );
    vi.mocked(userQueries.getUserById).mockResolvedValue([
      { usage: { resumeUploads: 0 } },
    ] as any);
    vi.mocked(userQueries.updateUserUsage).mockResolvedValue(undefined as any);

    const checker = new PlanLimitChecker('resumeUploads');
    const middleware = checker.check();
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(userQueries.updateUserUsage).toHaveBeenCalledWith('user-1', 'resumeUploads');
  });

  it('should return 403 for FREE user at limit', async () => {
    const {
      req, res, next,
    } = createMockReqResNext();

    vi.mocked(jwt.verify).mockReturnValue({ user: { id: 'user-1' } } as any);
    vi.mocked(paymentSubscriptionQueries.getUserCurrentSubscription).mockResolvedValue(
      { plan: 'FREE' } as any
    );
    vi.mocked(userQueries.getUserById).mockResolvedValue([
      { usage: { resumeUploads: 1 } },
    ] as any);

    const checker = new PlanLimitChecker('resumeUploads');
    const middleware = checker.check();
    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'LIMIT_EXCEEDED',
          plan: 'FREE',
        })
    );
  });

  it('should pass for BASIC user under limit', async () => {
    const {
      req, res, next,
    } = createMockReqResNext();

    vi.mocked(jwt.verify).mockReturnValue({ user: { id: 'user-2' } } as any);
    vi.mocked(paymentSubscriptionQueries.getUserCurrentSubscription).mockResolvedValue(
      { plan: 'BASIC' } as any
    );
    vi.mocked(userQueries.getUserById).mockResolvedValue([
      { usage: { resumeUploads: 1 } },
    ] as any);
    vi.mocked(userQueries.updateUserUsage).mockResolvedValue(undefined as any);

    const checker = new PlanLimitChecker('resumeUploads');
    const middleware = checker.check();
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 403 for BASIC user at limit', async () => {
    const {
      req, res, next,
    } = createMockReqResNext();

    vi.mocked(jwt.verify).mockReturnValue({ user: { id: 'user-2' } } as any);
    vi.mocked(paymentSubscriptionQueries.getUserCurrentSubscription).mockResolvedValue(
      { plan: 'BASIC' } as any
    );
    vi.mocked(userQueries.getUserById).mockResolvedValue([
      { usage: { resumeUploads: 3 } },
    ] as any);

    const checker = new PlanLimitChecker('resumeUploads');
    const middleware = checker.check();
    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'LIMIT_EXCEEDED',
          plan: 'BASIC',
        })
    );
  });

  it('should always pass for PRO user (unlimited)', async () => {
    const {
      req, res, next,
    } = createMockReqResNext();

    vi.mocked(jwt.verify).mockReturnValue({ user: { id: 'user-3' } } as any);
    vi.mocked(paymentSubscriptionQueries.getUserCurrentSubscription).mockResolvedValue(
      { plan: 'PRO' } as any
    );
    vi.mocked(userQueries.getUserById).mockResolvedValue([
      { usage: { resumeUploads: 9999 } },
    ] as any);
    vi.mocked(userQueries.updateUserUsage).mockResolvedValue(undefined as any);

    const checker = new PlanLimitChecker('resumeUploads');
    const middleware = checker.check();
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should default to FREE plan when user has no active subscription', async () => {
    const {
      req, res, next,
    } = createMockReqResNext();

    vi.mocked(jwt.verify).mockReturnValue({ user: { id: 'user-4' } } as any);
    // No active subscription returns null
    vi.mocked(paymentSubscriptionQueries.getUserCurrentSubscription).mockResolvedValue(
      null as any
    );
    vi.mocked(userQueries.getUserById).mockResolvedValue([
      { usage: { resumeUploads: 1 } },
    ] as any);

    const checker = new PlanLimitChecker('resumeUploads');
    const middleware = checker.check();
    await middleware(req, res, next);

    // With no subscription, defaults to FREE plan, and usage of 1 hits the FREE limit of 1
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ plan: 'FREE' })
    );
  });

  it('should return 401 for invalid JWT token', async () => {
    const {
      req, res, next,
    } = createMockReqResNext();

    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error('jwt malformed');
    });

    const checker = new PlanLimitChecker('resumeUploads');
    const middleware = checker.check();
    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: 'INVALID_TOKEN' }),
        })
    );
  });
});
