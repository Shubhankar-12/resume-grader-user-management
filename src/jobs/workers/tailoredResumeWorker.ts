import { jobQueries } from '../../db/queries/JobQueries';
import {
  extractedResumeQueries,
  tailoredResumeQueries,
  creditTransactionQueries, userQueries,
} from '../../db/queries';
import { generateTailoredResume } from '../../prompts';
import {
  isInfraError,
  type CreditContext,
} from '../../common_middleware/creditMiddleware';

interface TailoredResumeJobData {
  jobId: string;
  resume_id: string;
  user_id: string;
  job_description: string;
  __credits?: CreditContext;
}

async function refundIfInfra(
    credits: CreditContext | undefined,
    err: unknown
): Promise<void> {
  if (!credits) return;
  if (!isInfraError(err)) return;
  try {
    await creditTransactionQueries.recordRefund(
        credits.userId, credits.preJobId, credits.cost
    );
    await userQueries.incrementCreditBalance(credits.userId, credits.cost);
  } catch (refundErr) {
    console.error(
        '[tailoredResumeWorker] Failed to refund credits for job',
        credits.preJobId,
        refundErr
    );
  }
}

export async function processTailoredResumeJob(
    data: TailoredResumeJobData
): Promise<void> {
  const { jobId, resume_id, user_id, job_description, __credits } = data;

  try {
    await jobQueries.updateStatus(jobId, 'processing');
    await jobQueries.incrementAttempts(jobId);

    // Get extracted resume
    const extractedResume =
      await extractedResumeQueries.getExtractedResumebyResumeId({
        resume_id,
      });
    if (extractedResume.length === 0) {
      await jobQueries.updateStatus(jobId, 'failed', {
        error: 'Extracted resume not found',
      });
      return;
    }

    // Generate tailored resume via AI
    const tailoredData = await generateTailoredResume(
        extractedResume[0],
        job_description
    );
    if (!tailoredData) {
      await jobQueries.updateStatus(jobId, 'failed', {
        error: 'AI tailored resume generation returned empty result',
      });
      return;
    }

    // Persist tailored resume
    const created = await tailoredResumeQueries.create({
      ...tailoredData,
      resume_id,
      user_id,
      job_description,
    });

    await jobQueries.updateStatus(jobId, 'completed', {
      result: {
        tailored_resume_id: created._id,
        atsScore: created.atsScore,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown worker error';
    await jobQueries.updateStatus(jobId, 'failed', { error: message });
    // Refund credits on infra failure (provider outage, network, etc.)
    await refundIfInfra(__credits, error);
  }
}
