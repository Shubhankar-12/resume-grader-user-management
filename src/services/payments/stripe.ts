import Stripe from 'stripe';
import type {
  PaymentProvider, CheckoutSessionParams, CheckoutSessionResult, NormalizedWebhookEvent,
} from './types';

export class StripeProvider implements PaymentProvider {
  readonly name = 'stripe' as const;
  private client: Stripe;
  private webhookSecret: string;

  constructor(secretKey: string, webhookSecret: string) {
    this.client = new Stripe(secretKey, { apiVersion: '2025-08-27.basil' });
    this.webhookSecret = webhookSecret;
  }

  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult> {
    const session = await this.client.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: params.providerPriceId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.existingCustomerId ? undefined : params.customerEmail,
      customer: params.existingCustomerId,
      client_reference_id: params.userId,
      metadata: { userId: params.userId, planId: params.planId },
    });
    return {
      checkoutUrl: session.url!,
      sessionId: session.id,
      provider: 'stripe',
    };
  }

  async cancelSubscription(providerSubscriptionId: string): Promise<void> {
    await this.client.subscriptions.cancel(providerSubscriptionId);
  }

  verifyWebhook(rawBody: Buffer, signature: string): NormalizedWebhookEvent {
    const event = this.client.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    return this.normalize(event);
  }

  private normalize(event: Stripe.Event): NormalizedWebhookEvent {
    let eventType: NormalizedWebhookEvent['eventType'] = 'unknown';
    let subscriptionId: string | undefined;
    let customerId: string | undefined;
    let invoiceId: string | undefined;

    switch (event.type) {
      case 'checkout.session.completed': {
        eventType = 'subscription.created';
        const obj = event.data.object as Stripe.Checkout.Session;
        subscriptionId = typeof obj.subscription === 'string' ? obj.subscription : obj.subscription?.id;
        customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id ?? undefined;
        break;
      }
      case 'invoice.paid': {
        eventType = 'subscription.renewed';
        const obj = event.data.object as Stripe.Invoice;
        invoiceId = obj.id;
        subscriptionId = extractInvoiceSubscriptionId(obj);
        customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id;
        break;
      }
      case 'invoice.payment_failed': {
        eventType = 'payment.failed';
        const obj = event.data.object as Stripe.Invoice;
        invoiceId = obj.id;
        subscriptionId = extractInvoiceSubscriptionId(obj);
        customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id;
        break;
      }
      case 'customer.subscription.deleted': {
        eventType = 'subscription.cancelled';
        const obj = event.data.object as Stripe.Subscription;
        subscriptionId = obj.id;
        customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer.id;
        break;
      }
    }

    return {
      eventType,
      providerEventId: event.id,
      provider: 'stripe',
      subscriptionId,
      customerId,
      invoiceId,
      metadata: (event.data.object as { metadata?: Record<string, any> }).metadata ?? {},
      raw: event,
    };
  }
}

/**
 * Extract subscription id from an Invoice across Stripe API versions.
 * Older API versions exposed `invoice.subscription` directly; newer versions
 * (2025-08-27.basil+) nest it under `invoice.parent.subscription_details.subscription`.
 */
function extractInvoiceSubscriptionId(invoice: Stripe.Invoice): string | undefined {
  const legacy = (invoice as unknown as { subscription?: string | Stripe.Subscription }).subscription;
  if (legacy) {
    return typeof legacy === 'string' ? legacy : legacy.id;
  }
  const sub = invoice.parent?.subscription_details?.subscription;
  if (sub) {
    return typeof sub === 'string' ? sub : sub.id;
  }
  return undefined;
}
