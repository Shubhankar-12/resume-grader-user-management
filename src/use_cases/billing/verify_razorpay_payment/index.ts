import crypto from 'crypto';

interface Input {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function verifyRazorpayPaymentUseCase(input: Input): Promise<{ verified: true }> {
  if (!input.razorpay_order_id || !input.razorpay_payment_id || !input.razorpay_signature) {
    throw new Error('INVALID_INPUT');
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error('RAZORPAY_KEY_SECRET not configured');

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`)
    .digest('hex');

  // Constant-time comparison to prevent timing attacks.
  const provided = Buffer.from(input.razorpay_signature, 'hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  if (provided.length !== expectedBuf.length || !crypto.timingSafeEqual(provided, expectedBuf)) {
    throw new Error('INVALID_SIGNATURE');
  }

  return { verified: true };
}
