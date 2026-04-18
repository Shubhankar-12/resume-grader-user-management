import type { Request, Response } from 'express';
import { getCreditBalanceUseCase } from './index';

export async function getCreditBalanceController(req: Request, res: Response) {
  try {
    const userId =
      res.locals?.auth?.decoded_token?.user?.id ??
      (req as any).user?.id ??
      (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await getCreditBalanceUseCase(userId);
    return res.status(200).json({ body: result });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
