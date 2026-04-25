import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import crypto from 'crypto';
import { verifyRazorpayPaymentUseCase } from '../index';

const SECRET = 'test_webhook_secret_123';

function signPayload(orderId: string, paymentId: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
}

describe('verifyRazorpayPaymentUseCase', () => {
  const originalSecret = process.env.RAZORPAY_KEY_SECRET;

  beforeEach(() => {
    process.env.RAZORPAY_KEY_SECRET = SECRET;
  });

  afterEach(() => {
    process.env.RAZORPAY_KEY_SECRET = originalSecret;
  });

  it('returns {verified: true} for a valid signature', async () => {
    const orderId = 'order_abc';
    const paymentId = 'pay_xyz';
    const signature = signPayload(orderId, paymentId, SECRET);

    const result = await verifyRazorpayPaymentUseCase({
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    });

    expect(result).toEqual({ verified: true });
  });

  it('throws INVALID_SIGNATURE for a tampered signature', async () => {
    const orderId = 'order_abc';
    const paymentId = 'pay_xyz';
    const signature = signPayload(orderId, paymentId, 'wrong_secret');

    await expect(verifyRazorpayPaymentUseCase({
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    })).rejects.toThrow('INVALID_SIGNATURE');
  });

  it('throws INVALID_INPUT for a missing field', async () => {
    await expect(verifyRazorpayPaymentUseCase({
      razorpay_order_id: 'order_abc',
      razorpay_payment_id: '',
      razorpay_signature: 'sig',
    })).rejects.toThrow('INVALID_INPUT');
  });
});
