import { Router } from 'express';
import { listPlansController } from '../use_cases/billing/list_plans/controller';

const router = Router();

router.get('/', listPlansController);

export default router;
