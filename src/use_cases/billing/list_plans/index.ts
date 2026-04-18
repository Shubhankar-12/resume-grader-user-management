import { planCatalogQueries } from '../../../db/queries/PlanCatalogQueries';
import type { Region } from '../../../services/payments/types';

export async function listPlansUseCase(region: Region) {
  return planCatalogQueries.listByRegion(region);
}
