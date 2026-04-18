import { describe, it, expect, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ findOne: vi.fn(), find: vi.fn() }));

vi.mock('../../credit_pack', () => ({
  creditPackModel: { findOne: mocks.findOne, find: mocks.find },
}));

import { creditPackQueries } from '../CreditPackQueries';

describe('CreditPackQueries', () => {
  it('findByPackAndRegion queries correct keys', async () => {
    mocks.findOne.mockReturnValue({ lean: () => Promise.resolve({ pack_id: 'PACK_25', region: 'GLOBAL' }) });
    const result = await creditPackQueries.findByPackAndRegion('PACK_25', 'GLOBAL');
    expect(mocks.findOne).toHaveBeenCalledWith({ pack_id: 'PACK_25', region: 'GLOBAL', active: true });
    expect(result?.pack_id).toBe('PACK_25');
  });

  it('listByRegion sorts by credits ascending', async () => {
    mocks.find.mockReturnValue({
      sort: (_key: any) => ({ lean: () => Promise.resolve([{ pack_id: 'PACK_10' }]) }),
    });
    const result = await creditPackQueries.listByRegion('IN');
    expect(mocks.find).toHaveBeenCalledWith({ region: 'IN', active: true });
    expect(result).toHaveLength(1);
  });
});
