import { PlanCatalog } from '../plan_catalog';
import type { PlanCatalogDoc } from '../plan_catalog/schema';

export const planCatalogQueries = {
  async findByPlanAndRegion(plan_id: PlanCatalogDoc['plan_id'], region: PlanCatalogDoc['region']) {
    return PlanCatalog.findOne({ plan_id, region, active: true }).lean();
  },
  async listByRegion(region: PlanCatalogDoc['region']) {
    return PlanCatalog.find({ region, active: true }).sort({ amount: 1 }).lean();
  },
};
