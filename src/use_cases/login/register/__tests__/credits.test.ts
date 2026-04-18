import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  recordGrant: vi.fn(),
  incrementCreditBalance: vi.fn(),
  create: vi.fn(),
  getUserByEmail: vi.fn(),
  findLoginByUserId: vi.fn(),
  createLogin: vi.fn(),
  createToken: vi.fn(),
}));

// pdf-parse executes file-read side effects on import; stub it before any
// indirect import chain (helpers/utils -> logger -> usecase) pulls it in.
vi.mock('pdf-parse', () => ({ default: vi.fn() }));

vi.mock('../../../../db', () => ({
  userQueries: {
    create: mocks.create,
    getUserByEmail: mocks.getUserByEmail,
    incrementCreditBalance: mocks.incrementCreditBalance,
  },
  loginQueries: {
    findLoginByUserId: mocks.findLoginByUserId,
    createLogin: mocks.createLogin,
  },
  creditTransactionQueries: {
    recordGrant: mocks.recordGrant,
  },
}));

vi.mock('../../../common/CreateToken', () => ({
  createToken: mocks.createToken,
}));

import { RegisterUserWithEmailUseCase } from '../usecase';

describe('RegisterUserWithEmailUseCase signup credits grant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('writes a signup_grant ledger entry (+10) and increments user.credit_balance', async () => {
    mocks.getUserByEmail.mockResolvedValue([]);
    mocks.create.mockResolvedValue({ _id: 'new-user-id', name: 'Jane' });
    mocks.findLoginByUserId.mockResolvedValue([]);
    mocks.createLogin.mockResolvedValue({});
    mocks.createToken.mockReturnValue('jwt-token');

    const useCase = new RegisterUserWithEmailUseCase();
    const result = await useCase.execute({
      name: 'Jane',
      email: 'jane@example.com',
      password: 'hashed',
    });

    expect(mocks.recordGrant).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'new-user-id',
      delta: 10,
      reason: 'signup_grant',
      source: 'system',
      referenceId: 'signup:new-user-id',
      expiresOn: null,
    }));
    expect(mocks.incrementCreditBalance).toHaveBeenCalledWith('new-user-id', 10);
    // Sanity: use case still returns a token on the success path.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result as any).value?.token).toBe('jwt-token');
  });

  it('does NOT grant credits when the user already exists', async () => {
    mocks.getUserByEmail.mockResolvedValue([{ _id: 'existing-user' }]);

    const useCase = new RegisterUserWithEmailUseCase();
    await useCase.execute({
      name: 'Jane',
      email: 'jane@example.com',
      password: 'hashed',
    });

    expect(mocks.recordGrant).not.toHaveBeenCalled();
    expect(mocks.incrementCreditBalance).not.toHaveBeenCalled();
  });
});
