// src/use_cases/resume_builder/update/__tests__/usecase.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
const mocks = vi.hoisted(() => ({ update: vi.fn() }));
vi.mock('../../../../db/queries', () => ({ resumeDraftQueries: { update: mocks.update } }));
import { UpdateResumeDraftUseCase } from '../usecase';

describe('UpdateResumeDraftUseCase', () => {
  beforeEach(() => vi.clearAllMocks());
  it('applies only whitelisted fields', async () => {
    mocks.update.mockResolvedValue({ resume_draft_id: 'D1', title: 'New' });
    const res = await new UpdateResumeDraftUseCase().execute({
      resume_draft_id: 'D1',
      patch: { title: 'New', user_id: 'HACK', status_field: 'DISABLED' } as any,
    });
    expect(res.isErrClass()).toBe(false);
    const arg = mocks.update.mock.calls[0][0];
    expect(arg.resume_draft_id).toBe('D1');
    expect(arg.title).toBe('New');
    expect(arg.user_id).toBeUndefined();
    expect(arg.status_field).toBeUndefined();
  });
});
