import type { Request, Response } from 'express';
import { listPlansUseCase } from './index';
import type { Region } from '../../../services/payments/types';

export async function listPlansController(req: Request, res: Response) {
  try {
    const currency = req.query.currency === 'INR' ? 'INR' : 'USD';
    const region: Region = currency === 'INR' ? 'IN' : 'GLOBAL';
    const plans = await listPlansUseCase(region);
    return res.status(200).json({ body: plans });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
