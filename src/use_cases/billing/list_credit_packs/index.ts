import { creditPackQueries } from '../../../db/queries/CreditPackQueries';
import type { Region } from '../../../services/payments/types';

export async function listCreditPacksUseCase(region: Region) {
  return creditPackQueries.listByRegion(region);
}
