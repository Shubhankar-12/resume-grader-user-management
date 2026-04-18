import { webhookEventQueries } from '../../../db/queries/WebhookEventQueries';
import { applyWebhookEvent } from '../apply_webhook_event';
import type { NormalizedWebhookEvent } from '../../../services/payments/types';

export async function handleRazorpayWebhookUseCase(event: NormalizedWebhookEvent) {
  const fresh = await webhookEventQueries.recordIfNew(
      'razorpay',
      event.providerEventId,
      event.eventType
  );
  if (!fresh) return { skipped: true, reason: 'duplicate' };
  return applyWebhookEvent(event);
}
