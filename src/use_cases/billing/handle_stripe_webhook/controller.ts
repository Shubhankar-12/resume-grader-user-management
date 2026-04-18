import type { Request, Response } from 'express';
import { getPaymentProvider } from '../../../services/payments';
import { handleStripeWebhookUseCase } from './index';

export async function stripeWebhookController(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'] as string;
  if (!signature) return res.status(400).json({ error: 'Missing signature' });

  const provider = getPaymentProvider('GLOBAL');
  try {
    // req.body MUST be a raw Buffer here — the raw body parser is mounted in app.ts
    const event = provider.verifyWebhook(req.body as Buffer, signature);
    const result = await handleStripeWebhookUseCase(event);
    return res.status(200).json(result);
  } catch (e: any) {
    console.error('stripe webhook error:', e.message);
    return res.status(400).json({ error: e.message });
  }
}
