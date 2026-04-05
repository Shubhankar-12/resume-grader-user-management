import { Router } from 'express';
import { GetAnalyticsController } from '../use_cases/ai_analytics/get_analytics';

const router = Router();
const controller = new GetAnalyticsController();

router.get('/analytics', (req, res) => controller.execute(req, res));

export { router as aiAnalyticsRouter };
