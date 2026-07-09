/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from 'uuid';
import { Request, Response } from 'express';
import { BaseController } from '../../../base_classes';
import {
  improveResumeBullet,
  generateResumeSummary,
  suggestResumeSkills,
  polishResumeDescription,
} from '../../../prompts';
import { refundCreditsOnInfraError } from '../../../common_middleware/creditMiddleware';
import { userQueries, creditTransactionQueries } from '../../../db/queries';
import { getCost } from '../../../config/creditCosts';

function userIdOf(res: Response): string | undefined {
  return (res.locals as any)?.auth?.decoded_token?.user?.id;
}

/** POST /ai/improve-bullet — credit-gated (requireCredits ran already). */
class ImproveBulletController extends BaseController {
  async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const { bullet = '', context = '' } = req.body ?? {};
      const data = await improveResumeBullet(String(bullet), String(context));
      res.locals.response = this.success(data);
    } catch (err) {
      await refundCreditsOnInfraError(res, err);
      res.locals.response = this.fail({
        errors: [], message: 'AI request failed', statusCode: 502,
      });
    }
  }
}

/** POST /ai/summary — credit-gated. */
class SummaryController extends BaseController {
  async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const { resume = '' } = req.body ?? {};
      const payload = typeof resume === 'string' ? resume : JSON.stringify(resume);
      const data = await generateResumeSummary(payload);
      res.locals.response = this.success(data);
    } catch (err) {
      await refundCreditsOnInfraError(res, err);
      res.locals.response = this.fail({
        errors: [], message: 'AI request failed', statusCode: 502,
      });
    }
  }
}

/** POST /ai/skills — credit-gated. */
class SkillsController extends BaseController {
  async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const { role = '', experience = '', existing = '' } = req.body ?? {};
      const existingStr = Array.isArray(existing) ? existing.join(', ') : String(existing);
      const data = await suggestResumeSkills(String(role), String(experience), existingStr);
      res.locals.response = this.success(data);
    } catch (err) {
      await refundCreditsOnInfraError(res, err);
      res.locals.response = this.fail({
        errors: [], message: 'AI request failed', statusCode: 502,
      });
    }
  }
}

/** POST /ai/polish-description — credit-gated; rewrites a full experience description into strong bullets. */
class PolishDescriptionController extends BaseController {
  async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const { text = '', context = '' } = req.body ?? {};
      const data = await polishResumeDescription(String(text), String(context));
      res.locals.response = this.success(data);
    } catch (err) {
      await refundCreditsOnInfraError(res, err);
      res.locals.response = this.fail({
        errors: [], message: 'AI request failed', statusCode: 502,
      });
    }
  }
}

/** POST /ai/ghostwrite — FREE live suggestion (rate-limited; charged only on accept). */
class GhostwriteController extends BaseController {
  async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const { text = '', context = '' } = req.body ?? {};
      const data = await improveResumeBullet(String(text), String(context));
      res.locals.response = this.success(data);
    } catch {
      res.locals.response = this.fail({
        errors: [], message: 'AI request failed', statusCode: 502,
      });
    }
  }
}

/** POST /ai/ghostwrite/accept — charge 1 credit when a live suggestion is accepted. */
class GhostwriteAcceptController extends BaseController {
  async executeImpl(_req: Request, res: Response): Promise<void> {
    const userId = userIdOf(res);
    if (!userId) {
      res.locals.response = this.fail({
        errors: [], message: 'UNAUTHENTICATED', statusCode: 401,
      });
      return;
    }
    const cost = getCost('resume_ai_assist');
    const ok = await userQueries.tryDeductCreditBalance(userId, cost);
    if (!ok) {
      res.locals.response = this.fail({
        errors: [], message: 'INSUFFICIENT_CREDITS', statusCode: 402,
      });
      return;
    }
    try {
      await creditTransactionQueries.recordConsumption({
        userId, cost, action: 'resume_ai_assist', jobId: uuid(),
      });
    } catch {
      await userQueries.incrementCreditBalance(userId, cost).catch(() => { /* swallow */ });
      res.locals.response = this.fail({
        errors: [], message: 'CREDIT_LEDGER_ERROR', statusCode: 500,
      });
      return;
    }
    res.locals.response = this.success({ ok: true });
  }
}

export const improveBulletController = new ImproveBulletController();
export const summaryController = new SummaryController();
export const skillsController = new SkillsController();
export const polishDescriptionController = new PolishDescriptionController();
export const ghostwriteController = new GhostwriteController();
export const ghostwriteAcceptController = new GhostwriteAcceptController();
