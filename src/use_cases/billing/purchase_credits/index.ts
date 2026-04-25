import { UserQueries } from '../../../db/queries/UserQueries';
import { userModel } from '../../../db/user';
import { creditPackQueries } from '../../../db/queries/CreditPackQueries';
import { getPaymentProvider, type Region, type Currency } from '../../../services/payments';

interface Input {
  userId: string;
  packId: 'PACK_10' | 'PACK_25' | 'PACK_60';
  requestedCurrency: Currency;
  detectedRegion: Region;
}

export async function purchaseCreditsUseCase(input: Input) {
  const userQ = new UserQueries(userModel);
  const users = await userQ.getUserById(input.userId);
  const user = Array.isArray(users) ? users[0] : users;
  if (!user) throw new Error('User not found');

  // Currency lock enforcement — users cannot switch currency after first checkout.
  if (user.currency && user.currency !== input.requestedCurrency) {
    throw new Error(`Currency lock: account uses ${user.currency}`);
  }
  const effectiveRegion: Region = (user.region as Region | null | undefined) ?? input.detectedRegion;

  const pack = await creditPackQueries.findByPackAndRegion(input.packId, effectiveRegion);
  if (!pack) throw new Error(`No pack found for ${input.packId}/${effectiveRegion}`);

  const provider = getPaymentProvider(effectiveRegion);
  return provider.createCheckoutSession({
    userId: input.userId,
    planId: input.packId,
    providerPriceId: pack.provider_price_id,
    mode: 'payment',
    amount: pack.amount,
    currency: pack.currency as Currency,
    successUrl: `${process.env.FRONTEND_URL}/dashboard/billing/credits?checkout=success`,
    cancelUrl: `${process.env.FRONTEND_URL}/dashboard/billing/credits?checkout=cancel`,
    customerEmail: user.email,
    existingCustomerId:
      effectiveRegion === 'GLOBAL'
        ? user.stripe_customer_id ?? undefined
        : user.razorpay_customer_id ?? undefined,
    metadata: { packId: input.packId, userId: input.userId },
  });
}
