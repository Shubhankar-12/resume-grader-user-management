import { Schema, Types } from 'mongoose';

const ObjectId = Types.ObjectId;

export interface CreditTransactionDoc {
  user_id: Types.ObjectId;
  delta: number;
  reason:
    | 'subscription_grant'
    | 'signup_grant'
    | 'purchase'
    | 'consumption'
    | 'refund'
    | 'refund_external'
    | 'monthly_expiry';
  source: 'stripe' | 'razorpay' | 'ai_job' | 'system';
  reference_id: string;
  expires_on: Date | null;
  metadata: Record<string, unknown>;
  created_on: Date;
  updated_on: Date;
}

export const CreditTransactionSchema = new Schema<CreditTransactionDoc>(
  {
    user_id: { type: ObjectId, required: true, index: true },
    delta: { type: Number, required: true },
    reason: {
      type: String,
      required: true,
      enum: [
        'subscription_grant',
        'signup_grant',
        'purchase',
        'consumption',
        'refund',
        'refund_external',
        'monthly_expiry',
      ],
    },
    source: { type: String, required: true, enum: ['stripe', 'razorpay', 'ai_job', 'system'] },
    reference_id: { type: String, required: true },
    expires_on: { type: Date, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' } },
);

CreditTransactionSchema.index({ user_id: 1, expires_on: 1, created_on: 1 });
CreditTransactionSchema.index({ user_id: 1, reference_id: 1 }, { unique: true } as any);
