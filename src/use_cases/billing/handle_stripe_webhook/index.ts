import { webhookEventQueries } from '../../../db/queries/WebhookEventQueries';
import { userQueries } from '../../../db/queries';
import { paymentSubscriptionModel } from '../../../db/payment_subscription';
import type { NormalizedWebhookEvent } from '../../../services/payments/types';

export async function handleStripeWebhookUseCase(event: NormalizedWebhookEvent) {
  const fresh = await webhookEventQueries.recordIfNew('stripe', event.providerEventId, event.eventType);
  if (!fresh) return { skipped: true, reason: 'duplicate' };

  const userId = event.metadata?.userId;
  if (!userId) return { skipped: true, reason: 'no userId in metadata' };

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

    case 'subscription.renewed':
      await paymentSubscriptionModel.updateOne(
        { provider_subscription_id: event.subscriptionId },
        { $set: { status: 'ACTIVE', last_renewed_on: new Date() } },
      );
      break;

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
  }
  return { processed: true };
}
