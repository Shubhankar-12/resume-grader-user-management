import { describe, it, expect, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ listByRegion: vi.fn() }));

vi.mock('../../../../db/queries/PlanCatalogQueries', () => ({
  planCatalogQueries: { listByRegion: mocks.listByRegion },
}));

import { listPlansUseCase } from '../index';

describe('listPlansUseCase', () => {
  it('forwards region to planCatalogQueries.listByRegion', async () => {
    mocks.listByRegion.mockResolvedValue([{ plan_id: 'PRO', region: 'GLOBAL' }]);
    const plans = await listPlansUseCase('GLOBAL');
    expect(mocks.listByRegion).toHaveBeenCalledWith('GLOBAL');
    expect(plans).toHaveLength(1);
  });

  it('returns empty array when no plans match', async () => {
    mocks.listByRegion.mockResolvedValue([]);
    const plans = await listPlansUseCase('IN');
    expect(plans).toEqual([]);
  });
});
