export type Region = 'IN' | 'GLOBAL';
export type ProviderName = 'razorpay' | 'stripe';
export type Currency = 'INR' | 'USD';

export interface CheckoutSessionParams {
  userId: string;
  planId: string;
  providerPriceId: string | null;
  mode?: 'subscription' | 'payment';
  amount?: number;
  currency?: Currency;
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
  existingCustomerId?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResult {
  checkoutUrl?: string;            // Stripe returns a hosted URL; Razorpay payment mode omits it
  sessionId: string;               // Stripe session id OR Razorpay order id / subscription id
  provider: ProviderName;
  // Populated only when provider === 'razorpay' AND mode === 'payment':
  razorpayOrderId?: string;
  razorpayKeyId?: string;
  amount?: number;                 // paise
  currency?: Currency;
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
