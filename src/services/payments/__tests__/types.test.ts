import { describe, it, expectTypeOf } from 'vitest';
import type { PaymentProvider, CheckoutSessionParams, CheckoutSessionResult } from '../types';

describe('PaymentProvider types', () => {
  it('CheckoutSessionParams has required fields', () => {
    expectTypeOf<CheckoutSessionParams>().toHaveProperty('userId');
    expectTypeOf<CheckoutSessionParams>().toHaveProperty('planId');
    expectTypeOf<CheckoutSessionParams>().toHaveProperty('successUrl');
    expectTypeOf<CheckoutSessionParams>().toHaveProperty('cancelUrl');
  });
});
