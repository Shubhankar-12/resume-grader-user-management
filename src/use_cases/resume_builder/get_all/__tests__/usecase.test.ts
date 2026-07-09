// src/use_cases/resume_builder/get_all/__tests__/usecase.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
const mocks = vi.hoisted(() => ({ getByUserId: vi.fn() }));
vi.mock('../../../../db/queries', () => ({ resumeDraftQueries: { getByUserId: mocks.getByUserId } }));
import { GetAllResumeDraftsUseCase } from '../usecase';

describe('GetAllResumeDraftsUseCase', () => {
  beforeEach(() => vi.clearAllMocks());
  it('returns the user drafts', async () => {
    mocks.getByUserId.mockResolvedValue([{ resume_draft_id: 'D1', title: 'CV' }]);
    const res = await new GetAllResumeDraftsUseCase().execute({ user_id: 'u1' });
    expect(res.isErrClass()).toBe(false);
    expect(mocks.getByUserId).toHaveBeenCalledWith('u1');
    expect(res.value).toEqual([{ resume_draft_id: 'D1', title: 'CV' }]);
  });
});
