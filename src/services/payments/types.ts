export type Region = 'IN' | 'GLOBAL';
export type ProviderName = 'razorpay' | 'stripe';
export type Currency = 'INR' | 'USD';

export interface CheckoutSessionParams {
  userId: string;
  planId: string;
  providerPriceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
  existingCustomerId?: string;
}

export interface CheckoutSessionResult {
  checkoutUrl: string;
  sessionId: string;
  provider: ProviderName;
}

export interface NormalizedWebhookEvent {
  eventType:
    | 'subscription.created'
    | 'subscription.renewed'
    | 'subscription.cancelled'
    | 'payment.failed'
    | 'pack.purchased'
    | 'refund.issued'
    | 'unknown';
  providerEventId: string;
  provider: ProviderName;
  subscriptionId?: string;
  customerId?: string;
  invoiceId?: string;
  metadata: Record<string, any>;
  raw: unknown;
}

export interface PaymentProvider {
  readonly name: ProviderName;
  createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult>;
  cancelSubscription(providerSubscriptionId: string): Promise<void>;
  verifyWebhook(rawBody: Buffer, signature: string): NormalizedWebhookEvent;
}
