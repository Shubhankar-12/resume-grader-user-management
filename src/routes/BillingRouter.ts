import { Router } from 'express';
import { createCheckoutSessionController } from '../use_cases/billing/create_checkout_session/controller';
import { purchaseCreditsController } from '../use_cases/billing/purchase_credits/controller';
import { getCreditBalanceController } from '../use_cases/billing/get_credit_balance/controller';
import { listCreditPacksController } from '../use_cases/billing/list_credit_packs/controller';
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

router.get(
    '/credits/balance',
    requestAuthenticator.authenticate([POLICIES.ADMIN_POLICY]),
    getCreditBalanceController
);

// Public route — no auth middleware
router.get('/credits/packs', listCreditPacksController);

export default router;
