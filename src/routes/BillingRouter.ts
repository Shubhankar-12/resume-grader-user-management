import { Router } from 'express';
import { createCheckoutSessionController } from '../use_cases/billing/create_checkout_session/controller';
import { requestAuthenticator } from '../common_middleware/authentication/authenticate';
import { POLICIES } from '../common_middleware/policies';

const router = Router();

router.post(
    '/checkout',
    requestAuthenticator.authenticate([POLICIES.ADMIN_POLICY]),
    createCheckoutSessionController
);

export default router;
