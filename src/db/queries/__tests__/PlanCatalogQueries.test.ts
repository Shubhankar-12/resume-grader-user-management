import { describe, it, expect, vi } from 'vitest';
import { planCatalogQueries } from '../PlanCatalogQueries';
import { PlanCatalog } from '../../plan_catalog';

vi.mock('../../plan_catalog', () => ({
  PlanCatalog: {
    findOne: vi.fn(),
    find: vi.fn(),
  },
}));

describe('PlanCatalogQueries', () => {
  it('findByPlanAndRegion queries correct keys', async () => {
    (PlanCatalog.findOne as any).mockReturnValue({ lean: () => Promise.resolve({ plan_id: 'PRO', region: 'GLOBAL' }) });
    const result = await planCatalogQueries.findByPlanAndRegion('PRO', 'GLOBAL');
    expect(PlanCatalog.findOne).toHaveBeenCalledWith({ plan_id: 'PRO', region: 'GLOBAL', active: true });
    expect(result?.plan_id).toBe('PRO');
  });

  it('listByRegion returns active plans for region', async () => {
    (PlanCatalog.find as any).mockReturnValue({
      sort: () => ({ lean: () => Promise.resolve([{ plan_id: 'STARTER' }, { plan_id: 'PRO' }]) }),
    });
    const result = await planCatalogQueries.listByRegion('GLOBAL');
    expect(PlanCatalog.find).toHaveBeenCalledWith({ region: 'GLOBAL', active: true });
    expect(result).toHaveLength(2);
  });
});
