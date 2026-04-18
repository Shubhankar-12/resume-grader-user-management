import { Schema } from 'mongoose';

export interface PlanCatalogDoc {
  plan_id: 'FREE' | 'STARTER' | 'BASIC' | 'PRO' | 'CAREER_PLUS';
  region: 'IN' | 'GLOBAL';
  provider: 'razorpay' | 'stripe';
  provider_price_id: string;
  amount: number;
  currency: 'INR' | 'USD';
  monthly_credits: number;
  features: Record<string, unknown>;
  active: boolean;
  created_on: Date;
  updated_on: Date;
}

export const PlanCatalogSchema = new Schema<PlanCatalogDoc>({
  plan_id: { type: String, required: true, enum: ['FREE', 'STARTER', 'BASIC', 'PRO', 'CAREER_PLUS'] },
  region: { type: String, required: true, enum: ['IN', 'GLOBAL'] },
  provider: { type: String, required: true, enum: ['razorpay', 'stripe'] },
  provider_price_id: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, enum: ['INR', 'USD'] },
  monthly_credits: { type: Number, required: true, default: 0 },
  features: { type: Schema.Types.Mixed, default: {} },
  active: { type: Boolean, default: true },
}, {
  timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
});

PlanCatalogSchema.index({ plan_id: 1, region: 1 }, { unique: true } as any);
