import { model } from 'mongoose';
import { CreditPackSchema, CreditPackDoc } from './schema';

export const creditPackModel = model<CreditPackDoc>('CreditPack', CreditPackSchema, 'credit_packs');
