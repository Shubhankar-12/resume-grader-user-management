import type { Request, Response } from 'express';
import { getPaymentProvider } from '../../../services/payments';
import { handleRazorpayWebhookUseCase } from './index';

export async function razorpayWebhookController(req: Request, res: Response) {
  const signature = req.headers['x-razorpay-signature'] as string;
  if (!signature) return res.status(400).json({ error: 'Missing signature' });

  const provider = getPaymentProvider('IN');
  try {
    // req.body MUST be a raw Buffer here — the raw body parser is mounted in app.ts
    const event = provider.verifyWebhook(req.body as Buffer, signature);
    const result = await handleRazorpayWebhookUseCase(event);
    return res.status(200).json(result);
  } catch (e: any) {
    console.error('razorpay webhook error:', e.message);
    return res.status(400).json({ error: e.message });
  }
}
