import { jobQueries } from '../../db/queries/JobQueries';
import {
  extractedResumeQueries,
  coverLetterQueries,
  creditTransactionQueries, userQueries,
} from '../../db/queries';
import { generateCoverLetterStreaming } from '../../prompts';
import {
  isInfraError,
  type CreditContext,
} from '../../common_middleware/creditMiddleware';

interface CoverLetterJobData {
  jobId: string;
  resume_id: string;
  user_id: string;
  role: string;
  company: string;
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
        '[coverLetterWorker] Failed to refund credits for job',
        credits.preJobId,
        refundErr
    );
  }
}

export async function processCoverLetterJob(
    data: CoverLetterJobData
): Promise<void> {
  const { jobId, resume_id, user_id, role, company, job_description, __credits } = data;

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

    // Generate cover letter via AI
    const coverLetterData = await generateCoverLetterStreaming(
        extractedResume[0],
        job_description,
        role,
        company,
        jobId
    );
    if (!coverLetterData) {
      await jobQueries.updateStatus(jobId, 'failed', {
        error: 'AI cover letter generation returned empty result',
      });
      return;
    }

    // Persist cover letter
    const createdCoverLetter = await coverLetterQueries.create({
      ...coverLetterData,
      resume_id,
      user_id,
      role,
      company,
      job_description,
    });

    await jobQueries.updateStatus(jobId, 'completed', {
      result: {
        cover_letter_id: createdCoverLetter._id,
        cover_letter: createdCoverLetter.cover_letter,
        cover_letter_summary: createdCoverLetter.cover_letter_summary,
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
