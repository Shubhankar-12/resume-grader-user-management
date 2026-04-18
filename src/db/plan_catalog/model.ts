import { model } from 'mongoose';
import { PlanCatalogSchema, PlanCatalogDoc } from './schema';

export const PlanCatalog = model<PlanCatalogDoc>('PlanCatalog', PlanCatalogSchema, 'plan_catalog');
