import { creditPackModel } from '../credit_pack';
import type { CreditPackDoc } from '../credit_pack/schema';

export const creditPackQueries = {
  async findByPackAndRegion(pack_id: CreditPackDoc['pack_id'], region: CreditPackDoc['region']) {
    return creditPackModel.findOne({ pack_id, region, active: true }).lean();
  },
  async listByRegion(region: CreditPackDoc['region']) {
    return creditPackModel.find({ region, active: true }).sort({ credits: 1 }).lean();
  },
};
