import { creditTransactionModel } from '../credit_transaction';
import type { CreditTransactionDoc } from '../credit_transaction/schema';

interface GrantInput {
  userId: string;
  delta: number;
  reason: CreditTransactionDoc['reason'];
  source: CreditTransactionDoc['source'];
  referenceId: string;
  expiresOn?: Date | null;
  metadata?: Record<string, unknown>;
}

interface ConsumeInput {
  userId: string;
  cost: number;
  action: string;
  jobId: string;
}

export const creditTransactionQueries = {
  async recordGrant(input: GrantInput) {
    return creditTransactionModel.create({
      user_id: input.userId,
      delta: input.delta,
      reason: input.reason,
      source: input.source,
      reference_id: input.referenceId,
      expires_on: input.expiresOn ?? null,
      metadata: input.metadata ?? {},
    });
  },

  async recordConsumption(input: ConsumeInput) {
    return creditTransactionModel.create({
      user_id: input.userId,
      delta: -input.cost,
      reason: 'consumption',
      source: 'ai_job',
      reference_id: input.jobId,
      expires_on: null,
      metadata: { action: input.action },
    });
  },

  async recordRefund(userId: string, jobId: string, cost: number) {
    return creditTransactionModel.create({
      user_id: userId,
      delta: cost,
      reason: 'refund',
      source: 'ai_job',
      reference_id: `${jobId}:refund`,
      expires_on: null,
      metadata: { originalJobId: jobId },
    });
  },

  async recordMonthlyExpiry(userId: string, grantReferenceId: string, amount: number) {
    return creditTransactionModel.create({
      user_id: userId,
      delta: -amount,
      reason: 'monthly_expiry',
      source: 'system',
      reference_id: `${grantReferenceId}:expiry`,
      expires_on: null,
      metadata: { expiredGrant: grantReferenceId },
    });
  },

  async getBalance(userId: string): Promise<number> {
    const now = new Date();
    const result = await creditTransactionModel.aggregate([
      {
        $match: {
          user_id: userId,
          $or: [{ expires_on: null }, { expires_on: { $gt: now } }],
        },
      },
      { $group: { _id: null, total: { $sum: '$delta' } } },
    ]);
    return result[0]?.total ?? 0;
  },

  async findActiveSubscriptionGrant(userId: string) {
    const now = new Date();
    return creditTransactionModel.findOne({
      user_id: userId,
      reason: 'subscription_grant',
      expires_on: { $gt: now },
    }).lean();
  },
};
