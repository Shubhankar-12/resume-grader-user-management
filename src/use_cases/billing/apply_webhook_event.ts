import {
  userQueries,
  creditTransactionQueries,
  creditPackQueries,
  planCatalogQueries,
} from '../../db/queries';
import { creditTransactionModel } from '../../db/credit_transaction';
import { paymentSubscriptionModel } from '../../db/payment_subscription';
import type { NormalizedWebhookEvent } from '../../services/payments/types';

/**
 * Apply a normalized webhook event to the subscription, ledger, and user-cache state.
 * Provider-agnostic — Stripe and Razorpay both route through this after their own
 * signature verification and normalization.
 *
 * Returns `{ processed: true }` if the event was applied, or `{ skipped: true, reason }`
 * for cases like missing metadata on a subscription event.
 */
export async function applyWebhookEvent(
    event: NormalizedWebhookEvent
): Promise<{ processed?: boolean; skipped?: boolean; reason?: string }> {
  const userId = event.metadata?.userId;
  // Refund path derives user from original ledger entry, so userId in metadata isn't required there.
  if (!userId && event.eventType !== 'refund.issued') {
    return { skipped: true, reason: 'no userId in metadata' };
  }

  switch (event.eventType) {
    case 'subscription.created': {
      // Just create the subscription row. DO NOT grant credits here — invoice.paid
      // fires for both first payment and renewals and covers the grant idempotently.
      await paymentSubscriptionModel.create({
        user_id: userId,
        provider: event.provider,
        region: event.provider === 'stripe' ? 'GLOBAL' : 'IN',
        currency: event.provider === 'stripe' ? 'USD' : 'INR',
        provider_subscription_id: event.subscriptionId,
        plan: event.metadata?.planId,
        status: 'ACTIVE',
        start_date: new Date(),
        ...(event.provider === 'stripe'
          ? { stripe_customer_id: event.customerId }
          : { razorpay_customer_id: event.customerId }),
      });
      if (event.customerId) {
        await userQueries.updateUser({
          user_id: userId,
          ...(event.provider === 'stripe'
            ? { stripe_customer_id: event.customerId }
            : { razorpay_customer_id: event.customerId }),
        });
      }
      return { processed: true };
    }

    case 'subscription.renewed': {
      await paymentSubscriptionModel.updateOne(
          { provider_subscription_id: event.subscriptionId },
          { $set: { status: 'ACTIVE', last_renewed_on: new Date() } },
      );
      const sub: any = await paymentSubscriptionModel
          .findOne({ provider_subscription_id: event.subscriptionId })
          .lean();
      if (sub) {
        const plan = await planCatalogQueries.findByPlanAndRegion(sub.plan, sub.region);
        if (plan && plan.monthly_credits > 0) {
          const nextBilling = deriveNextBillingDate(event);
          await creditTransactionQueries.recordGrant({
            userId: String(sub.user_id),
            delta: plan.monthly_credits,
            reason: 'subscription_grant',
            source: event.provider,
            referenceId: event.invoiceId!,
            expiresOn: nextBilling,
          });
          await userQueries.incrementCreditBalance(
              String(sub.user_id),
              plan.monthly_credits
          );
        }
      }
      return { processed: true };
    }

    case 'subscription.cancelled':
      await paymentSubscriptionModel.updateOne(
          { provider_subscription_id: event.subscriptionId },
          { $set: { status: 'CANCELLED', cancelled_on: new Date(), end_date: new Date() } },
      );
      return { processed: true };

    case 'payment.failed':
      await paymentSubscriptionModel.updateOne(
          { provider_subscription_id: event.subscriptionId },
          { $set: { status: 'PAST_DUE' } },
      );
      return { processed: true };

    case 'pack.purchased': {
      const packId = (event.metadata as any)?.packId;
      if (!packId || !userId) return { skipped: true, reason: 'no packId or userId' };
      const region = event.provider === 'stripe' ? 'GLOBAL' : 'IN';
      const pack = await creditPackQueries.findByPackAndRegion(packId, region);
      if (!pack) return { skipped: true, reason: 'pack not found' };
      await creditTransactionQueries.recordGrant({
        userId,
        delta: pack.credits,
        reason: 'purchase',
        source: event.provider,
        referenceId: event.providerEventId,
        expiresOn: null,
      });
      await userQueries.incrementCreditBalance(userId, pack.credits);
      if (event.customerId) {
        await userQueries.updateUser({
          user_id: userId,
          ...(event.provider === 'stripe'
            ? { stripe_customer_id: event.customerId }
            : { razorpay_customer_id: event.customerId }),
        });
      }
      return { processed: true };
    }

    case 'refund.issued': {
      const original: any = await creditTransactionModel
          .findOne({ reference_id: event.invoiceId })
          .lean();
      if (!original) return { skipped: true, reason: 'original grant not found' };
      await creditTransactionQueries.recordGrant({
        userId: String(original.user_id),
        delta: -original.delta,
        reason: 'refund_external',
        source: event.provider,
        referenceId: `${event.providerEventId}:refund`,
        expiresOn: null,
      });
      await userQueries.incrementCreditBalance(String(original.user_id), -original.delta);
      return { processed: true };
    }

    default:
      return { skipped: true, reason: 'unknown event type' };
  }
}

function deriveNextBillingDate(event: NormalizedWebhookEvent): Date {
  const raw: any = event.raw;
  // Stripe invoice.paid
  const stripePeriodEnd = raw?.data?.object?.lines?.data?.[0]?.period?.end;
  if (stripePeriodEnd) return new Date(stripePeriodEnd * 1000);
  // Razorpay subscription.charged — current_end is on subscription entity (epoch seconds)
  const rzpCurrentEnd = raw?.payload?.subscription?.entity?.current_end;
  if (rzpCurrentEnd) return new Date(rzpCurrentEnd * 1000);
  // Fallback: 30 days from now
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}
