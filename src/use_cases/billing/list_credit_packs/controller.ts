import type { Request, Response } from 'express';
import { listCreditPacksUseCase } from './index';
import type { Region } from '../../../services/payments/types';

export async function listCreditPacksController(req: Request, res: Response) {
  try {
    const currency = req.query.currency === 'INR' ? 'INR' : 'USD';
    const region: Region = currency === 'INR' ? 'IN' : 'GLOBAL';
    const packs = await listCreditPacksUseCase(region);
    return res.status(200).json({ body: packs });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
