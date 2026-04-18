import { Router, raw } from 'express';
import { razorpayWebhookController } from '../../use_cases/billing/handle_razorpay_webhook/controller';

const router = Router();

router.post('/razorpay', raw({ type: 'application/json' }), razorpayWebhookController);

export default router;
