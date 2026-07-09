// src/use_cases/resume_builder/get_by_id/__tests__/usecase.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
const mocks = vi.hoisted(() => ({ getById: vi.fn() }));
vi.mock('../../../../db/queries', () => ({ resumeDraftQueries: { getById: mocks.getById } }));
import { GetResumeDraftByIdUseCase } from '../usecase';

describe('GetResumeDraftByIdUseCase', () => {
  beforeEach(() => vi.clearAllMocks());
  it('returns the draft when found', async () => {
    mocks.getById.mockResolvedValue({ resume_draft_id: 'D1' });
    const res = await new GetResumeDraftByIdUseCase().execute({ resume_draft_id: 'D1' });
    expect(res.isErrClass()).toBe(false);
    expect(res.value).toMatchObject({ resume_draft_id: 'D1' });
  });
  it('errors when not found', async () => {
    mocks.getById.mockResolvedValue(null);
    const res = await new GetResumeDraftByIdUseCase().execute({ resume_draft_id: 'nope' });
    expect(res.isErrClass()).toBe(true);
  });
});
