import type { Request, Response } from 'express';
import { createCheckoutSessionUseCase } from './index';
import { userQueries } from '../../../db';
import type { Region, Currency } from '../../../services/payments';

export async function createCheckoutSessionController(req: Request, res: Response) {
  try {
    // Project convention: auth is attached by middleware at res.locals.auth.decoded_token.user
    const userId =
      res.locals?.auth?.decoded_token?.user?.id ??
      (req as any).user?.id ??
      (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { planId, currency } = req.body as { planId: string; currency: Currency };
    if (!planId || !currency) {
      return res.status(400).json({ error: 'planId and currency required' });
    }

    const detectedRegion: Region =
      (req.headers['x-vercel-ip-country'] as string) === 'IN' ? 'IN' : 'GLOBAL';

    const result = await createCheckoutSessionUseCase({
      userId,
      planId: planId as 'STARTER' | 'PRO' | 'CAREER_PLUS',
      requestedCurrency: currency,
      detectedRegion,
      updateUserRegion: async (uid, region, curr) => {
        await userQueries.updateUser({
          user_id: uid,
          region,
          currency: curr,
        });
      },
    });
    return res.status(200).json({ body: result });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
}
