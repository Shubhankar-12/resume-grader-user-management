import { Schema } from 'mongoose';

export interface CreditPackDoc {
  pack_id: 'PACK_10' | 'PACK_25' | 'PACK_60';
  credits: number;
  region: 'IN' | 'GLOBAL';
  provider: 'razorpay' | 'stripe';
  provider_price_id: string | null;
  amount: number;
  currency: 'INR' | 'USD';
  active: boolean;
  created_on: Date;
  updated_on: Date;
}

export const CreditPackSchema = new Schema<CreditPackDoc>(
    {
      pack_id: { type: String, required: true, enum: ['PACK_10', 'PACK_25', 'PACK_60'] },
      credits: { type: Number, required: true },
      region: { type: String, required: true, enum: ['IN', 'GLOBAL'] },
      provider: { type: String, required: true, enum: ['razorpay', 'stripe'] },
      provider_price_id: { type: String, default: null },
      amount: { type: Number, required: true },
      currency: { type: String, required: true, enum: ['INR', 'USD'] },
      active: { type: Boolean, default: true },
    },
    { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' } },
);

CreditPackSchema.index({ pack_id: 1, region: 1 }, { unique: true } as any);
