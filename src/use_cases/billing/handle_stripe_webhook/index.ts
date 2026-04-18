import { webhookEventQueries } from '../../../db/queries/WebhookEventQueries';
import {
  userQueries,
  creditTransactionQueries,
  creditPackQueries,
  planCatalogQueries,
} from '../../../db/queries';
import { paymentSubscriptionModel } from '../../../db/payment_subscription';
import { creditTransactionModel } from '../../../db/credit_transaction';
import type { NormalizedWebhookEvent } from '../../../services/payments/types';

export async function handleStripeWebhookUseCase(event: NormalizedWebhookEvent) {
  const fresh = await webhookEventQueries.recordIfNew('stripe', event.providerEventId, event.eventType);
  if (!fresh) return { skipped: true, reason: 'duplicate' };

  const userId = event.metadata?.userId;
  // Refunds do not require a userId in metadata — we derive it from the original ledger entry.
  if (!userId && event.eventType !== 'refund.issued') {
    return { skipped: true, reason: 'no userId in metadata' };
  }

  switch (event.eventType) {
    case 'subscription.created':
      await paymentSubscriptionModel.create({
        user_id: userId,
        provider: 'stripe',
        region: 'GLOBAL',
        currency: 'USD',
        provider_subscription_id: event.subscriptionId,
        stripe_customer_id: event.customerId,
        plan: event.metadata?.planId,
        status: 'ACTIVE',
        start_date: new Date(),
      });
      if (event.customerId) {
        await userQueries.updateUser({ user_id: userId, stripe_customer_id: event.customerId });
      }
      break;

    case 'subscription.renewed': {
      await paymentSubscriptionModel.updateOne(
        { provider_subscription_id: event.subscriptionId },
        { $set: { status: 'ACTIVE', last_renewed_on: new Date() } },
      );
      // Grant monthly credits — credits are granted ONLY on invoice.paid (handles initial + renewals).
      const sub = await paymentSubscriptionModel.findOne({ provider_subscription_id: event.subscriptionId }).lean();
      if (sub) {
        const plan = await planCatalogQueries.findByPlanAndRegion(
          (sub as any).plan,
          (sub as any).region,
        );
        if (plan && plan.monthly_credits > 0) {
          // Derive next billing date from invoice line period.end (epoch seconds)
          const rawInvoice: any = (event.raw as any)?.data?.object;
          const periodEndSec = rawInvoice?.lines?.data?.[0]?.period?.end;
          const nextBilling = periodEndSec
            ? new Date(periodEndSec * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await creditTransactionQueries.recordGrant({
            userId: String((sub as any).user_id),
            delta: plan.monthly_credits,
            reason: 'subscription_grant',
            source: 'stripe',
            referenceId: event.invoiceId!,
            expiresOn: nextBilling,
          });
          await userQueries.incrementCreditBalance(String((sub as any).user_id), plan.monthly_credits);
        }
      }
      break;
    }

    case 'subscription.cancelled':
      await paymentSubscriptionModel.updateOne(
        { provider_subscription_id: event.subscriptionId },
        { $set: { status: 'CANCELLED', cancelled_on: new Date(), end_date: new Date() } },
      );
      break;

    case 'payment.failed':
      await paymentSubscriptionModel.updateOne(
        { provider_subscription_id: event.subscriptionId },
        { $set: { status: 'PAST_DUE' } },
      );
      break;

    case 'pack.purchased': {
      const packId = (event.metadata as any)?.packId;
      const purchaseUserId = (event.metadata as any)?.userId ?? userId;
      if (!packId || !purchaseUserId) break;
      const pack = await creditPackQueries.findByPackAndRegion(packId, 'GLOBAL');
      if (!pack) break;
      await creditTransactionQueries.recordGrant({
        userId: purchaseUserId,
        delta: pack.credits,
        reason: 'purchase',
        source: 'stripe',
        referenceId: event.providerEventId,
        expiresOn: null,
      });
      await userQueries.incrementCreditBalance(purchaseUserId, pack.credits);
      // Also update user.stripe_customer_id if not set yet
      if (event.customerId) {
        await userQueries.updateUser({ user_id: purchaseUserId, stripe_customer_id: event.customerId });
      }
      break;
    }

    case 'refund.issued': {
      // Look up the original grant by invoiceId to know how many credits to claw back.
      const original: any = await creditTransactionModel.findOne({ reference_id: event.invoiceId }).lean();
      if (!original) break;
      await creditTransactionQueries.recordGrant({
        userId: String(original.user_id),
        delta: -original.delta, // negate whatever was granted
        reason: 'refund_external',
        source: 'stripe',
        referenceId: `${event.providerEventId}:refund`,
        expiresOn: null,
      });
      await userQueries.incrementCreditBalance(String(original.user_id), -original.delta);
      break;
    }
  }
  return { processed: true };
}
