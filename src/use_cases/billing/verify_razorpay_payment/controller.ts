import type { Request, Response } from 'express';
import { verifyRazorpayPaymentUseCase } from './index';

export async function verifyRazorpayPaymentController(req: Request, res: Response) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'INVALID_INPUT' });
    }

    const result = await verifyRazorpayPaymentUseCase({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    return res.status(200).json({ body: result });
  } catch (e: any) {
    if (e.message === 'INVALID_SIGNATURE') {
      return res.status(400).json({ error: 'INVALID_SIGNATURE' });
    }
    if (e.message === 'INVALID_INPUT') {
      return res.status(400).json({ error: 'INVALID_INPUT' });
    }
    return res.status(500).json({ error: 'VERIFY_FAILED' });
  }
}
