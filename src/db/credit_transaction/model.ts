import { model } from 'mongoose';
import { CreditTransactionSchema, CreditTransactionDoc } from './schema';
export const creditTransactionModel = model<CreditTransactionDoc>(
  'CreditTransaction',
  CreditTransactionSchema,
  'credit_transactions',
);
