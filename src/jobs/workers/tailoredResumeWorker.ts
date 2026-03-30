import { jobQueries } from '../../db/queries/JobQueries';
import {
  extractedResumeQueries,
  tailoredResumeQueries,
} from '../../db/queries';
import { generateTailoredResume } from '../../helpers/resumeAnalyzerAI';

interface TailoredResumeJobData {
  jobId: string;
  resume_id: string;
  user_id: string;
  job_description: string;
}

export async function processTailoredResumeJob(
    data: TailoredResumeJobData
): Promise<void> {
  const { jobId, resume_id, user_id, job_description } = data;

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
  }
}
