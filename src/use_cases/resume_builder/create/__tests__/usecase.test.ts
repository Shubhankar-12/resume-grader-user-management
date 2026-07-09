// src/use_cases/resume_builder/create/__tests__/usecase.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  getExtracted: vi.fn(),
}));
vi.mock('../../../../db/queries', () => ({
  resumeDraftQueries: { create: mocks.create },
  extractedResumeQueries: { getExtractedResumebyResumeId: mocks.getExtracted },
}));

import { CreateResumeDraftUseCase } from '../usecase';

describe('CreateResumeDraftUseCase', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates a blank draft when no seed id', async () => {
    mocks.create.mockResolvedValue({ resume_draft_id: 'D1' });
    const uc = new CreateResumeDraftUseCase();
    const res = await uc.execute({
      user_id: 'u1', title: 'CV', template_id: 'classic', seed_from_resume_id: null,
    });
    expect(res.isErrClass()).toBe(false);
    expect(mocks.getExtracted).not.toHaveBeenCalled();
    expect(mocks.create).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: 'u1', title: 'CV', template_id: 'classic' })
    );
  });

  it('seeds from an extracted resume when seed id present', async () => {
    mocks.getExtracted.mockResolvedValue([{ name: 'Ada', skills: ['C++'], experience: [] }]);
    mocks.create.mockResolvedValue({ resume_draft_id: 'D2' });
    const uc = new CreateResumeDraftUseCase();
    await uc.execute({
      user_id: 'u1', title: 'CV', template_id: 'modern', seed_from_resume_id: 'R9',
    });
    expect(mocks.getExtracted).toHaveBeenCalledWith({ resume_id: 'R9' });
    expect(mocks.create).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: 'u1', basics: expect.objectContaining({ name: 'Ada' }) })
    );
  });
});
