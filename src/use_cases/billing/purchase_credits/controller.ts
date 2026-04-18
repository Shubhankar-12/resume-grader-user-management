import type { Request, Response } from 'express';
import { purchaseCreditsUseCase } from './index';
import type { Currency, Region } from '../../../services/payments';

export async function purchaseCreditsController(req: Request, res: Response) {
  try {
    const userId =
      res.locals?.auth?.decoded_token?.user?.id ??
      (req as any).user?.id ??
      (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { packId, currency } = req.body as { packId: string; currency: Currency };
    if (!packId || !currency) {
      return res.status(400).json({ error: 'packId and currency required' });
    }

    const detectedRegion: Region =
      (req.headers['x-vercel-ip-country'] as string) === 'IN' ? 'IN' : 'GLOBAL';

    const result = await purchaseCreditsUseCase({
      userId,
      packId: packId as 'PACK_10' | 'PACK_25' | 'PACK_60',
      requestedCurrency: currency,
      detectedRegion,
    });

    return res.status(200).json({ body: result });
  } catch (e: any) {
    if (e.message === 'SUBSCRIPTION_REQUIRED') {
      return res.status(403).json({ error: 'SUBSCRIPTION_REQUIRED' });
    }
    return res.status(400).json({ error: e.message });
  }
}
