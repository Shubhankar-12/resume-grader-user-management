import { UserQueries } from '../../../db/queries/UserQueries';
import { userModel } from '../../../db/user';
import { planCatalogQueries } from '../../../db/queries/PlanCatalogQueries';
import { getPaymentProvider, type Region, type Currency } from '../../../services/payments';

interface Input {
  userId: string;
  planId: 'STARTER' | 'PRO' | 'CAREER_PLUS';
  requestedCurrency: Currency;
  detectedRegion: Region;
  updateUserRegion: (userId: string, region: Region, currency: Currency) => Promise<void>;
}

export async function createCheckoutSessionUseCase(input: Input) {
  const userQ = new UserQueries(userModel);
  const users = await userQ.getUserById(input.userId);
  const user = Array.isArray(users) ? users[0] : users;
  if (!user) throw new Error('User not found');

  // Currency lock enforcement
  if (user.currency && user.currency !== input.requestedCurrency) {
    throw new Error(`User currency lock: already set to ${user.currency}`);
  }

  // Lock region on first checkout
  const effectiveRegion: Region = user.region ?? input.detectedRegion;
  const effectiveCurrency: Currency = user.currency ?? input.requestedCurrency;
  if (!user.region) {
    await input.updateUserRegion(input.userId, effectiveRegion, effectiveCurrency);
  }

  const plan = await planCatalogQueries.findByPlanAndRegion(input.planId, effectiveRegion);
  if (!plan) throw new Error(`No plan found for ${input.planId}/${effectiveRegion}`);

  const provider = getPaymentProvider(effectiveRegion);
  return provider.createCheckoutSession({
    userId: input.userId,
    planId: input.planId,
    providerPriceId: plan.provider_price_id,
    successUrl: `${process.env.FRONTEND_URL}/dashboard?checkout=success`,
    cancelUrl: `${process.env.FRONTEND_URL}/plans?checkout=cancel`,
    customerEmail: user.email,
    existingCustomerId: plan.provider === 'stripe' ? user.stripe_customer_id : user.razorpay_customer_id,
  });
}
