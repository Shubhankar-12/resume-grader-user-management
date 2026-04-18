import { Router } from 'express';
import { createCheckoutSessionController } from '../use_cases/billing/create_checkout_session/controller';
import { purchaseCreditsController } from '../use_cases/billing/purchase_credits/controller';
import { requestAuthenticator } from '../common_middleware/authentication/authenticate';
import { POLICIES } from '../common_middleware/policies';

const router = Router();

router.post(
    '/checkout',
    requestAuthenticator.authenticate([POLICIES.ADMIN_POLICY]),
    createCheckoutSessionController
);

router.post(
    '/purchase-credits',
    requestAuthenticator.authenticate([POLICIES.ADMIN_POLICY]),
    purchaseCreditsController
);

export default router;
