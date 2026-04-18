import Razorpay from 'razorpay';
import crypto from 'crypto';
import type {
  PaymentProvider, CheckoutSessionParams, CheckoutSessionResult, NormalizedWebhookEvent,
} from './types';

export class RazorpayProvider implements PaymentProvider {
  readonly name = 'razorpay' as const;
  private client: Razorpay;
  private webhookSecret: string;

  constructor(keyId: string, keySecret: string, webhookSecret: string) {
    this.client = new Razorpay({ key_id: keyId, key_secret: keySecret });
    this.webhookSecret = webhookSecret;
  }

  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult> {
    const sub = await this.client.subscriptions.create({
      plan_id: params.providerPriceId,
      customer_notify: 1,
      total_count: 12,
      notes: { userId: params.userId, planId: params.planId },
    });
    return {
      checkoutUrl: (sub as any).short_url,
      sessionId: sub.id,
      provider: 'razorpay',
    };
  }

  async cancelSubscription(providerSubscriptionId: string): Promise<void> {
    await this.client.subscriptions.cancel(providerSubscriptionId, false);
  }

  verifyWebhook(rawBody: Buffer, signature: string): NormalizedWebhookEvent {
    const expected = crypto.createHmac('sha256', this.webhookSecret).update(rawBody).digest('hex');
    if (expected !== signature) throw new Error('Razorpay webhook signature mismatch');
    const event = JSON.parse(rawBody.toString());
    return this.normalize(event);
  }

  private normalize(event: any): NormalizedWebhookEvent {
    let eventType: NormalizedWebhookEvent['eventType'] = 'unknown';
    const payloadSub = event.payload?.subscription?.entity;
    const payloadPayment = event.payload?.payment?.entity;
    const payloadOrder = event.payload?.order?.entity;
    let customerId: string | undefined = payloadSub?.customer_id;
    let invoiceId: string | undefined = payloadPayment?.id;

    switch (event.event) {
      case 'subscription.activated':
      case 'subscription.authenticated':
        eventType = 'subscription.created';
        break;
      case 'subscription.charged':
        eventType = 'subscription.renewed';
        break;
      case 'subscription.cancelled':
      case 'subscription.completed':
        eventType = 'subscription.cancelled';
        break;
      case 'payment.failed':
        eventType = 'payment.failed';
        break;
      case 'order.paid': {
        // Razorpay one-time payment webhook for pack purchases.
        // Event structure: payload.order.entity (notes carry userId/packId) and payload.payment.entity.
        eventType = 'pack.purchased';
        customerId = payloadPayment?.customer_id ?? customerId;
        break;
      }
      case 'refund.created':
      case 'refund.processed':
      case 'payment.refunded': {
        eventType = 'refund.issued';
        // Razorpay payment id is the original grant's reference_id.
        invoiceId = payloadPayment?.id ?? invoiceId;
        customerId = payloadPayment?.customer_id ?? customerId;
        break;
      }
    }

    return {
      eventType,
      providerEventId:
        event.id ?? `${event.event}:${payloadSub?.id ?? payloadPayment?.id ?? payloadOrder?.id}`,
      provider: 'razorpay',
      subscriptionId: payloadSub?.id,
      customerId,
      invoiceId,
      metadata: payloadSub?.notes ?? payloadOrder?.notes ?? {},
      raw: event,
    };
  }
}
