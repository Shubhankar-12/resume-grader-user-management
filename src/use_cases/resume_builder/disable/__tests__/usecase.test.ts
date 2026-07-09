// src/use_cases/resume_builder/disable/__tests__/usecase.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
const mocks = vi.hoisted(() => ({ disable: vi.fn() }));
vi.mock('../../../../db/queries', () => ({ resumeDraftQueries: { disable: mocks.disable } }));
import { DisableResumeDraftUseCase } from '../usecase';

describe('DisableResumeDraftUseCase', () => {
  beforeEach(() => vi.clearAllMocks());
  it('disables for the owner', async () => {
    mocks.disable.mockResolvedValue({ ok: true });
    const res = await new DisableResumeDraftUseCase().execute({ resume_draft_id: 'D1', user_id: 'u1' });
    expect(res.isErrClass()).toBe(false);
    expect(mocks.disable).toHaveBeenCalledWith('D1', 'u1');
  });
  it('surfaces an error when the query throws (non-owner)', async () => {
    mocks.disable.mockRejectedValue(new Error('Unauthorized'));
    const res = await new DisableResumeDraftUseCase().execute({ resume_draft_id: 'D1', user_id: 'u2' });
    expect(res.isErrClass()).toBe(true);
  });
});
