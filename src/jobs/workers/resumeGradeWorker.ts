import { jobQueries } from '../../db/queries/JobQueries';
import {
  reportQueries, extractedResumeQueries,
} from '../../db/queries';
import { generateResumeReportFromExtractedText } from '../../prompts';

interface ResumeGradeJobData {
  jobId: string;
  resume_id: string;
  user_id: string;
}

export async function processResumeGradeJob(
    data: ResumeGradeJobData
): Promise<void> {
  const { jobId, resume_id } = data;

  try {
    await jobQueries.updateStatus(jobId, 'processing');
    await jobQueries.incrementAttempts(jobId);

    // Check if report already exists
    const existingReport = await reportQueries.getReportByResumeId(resume_id);
    if (existingReport.length > 0) {
      await jobQueries.updateStatus(jobId, 'completed', {
        result: existingReport[0],
      });
      return;
    }

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

    // Generate report via AI
    const reportData = await generateResumeReportFromExtractedText(
        extractedResume[0]
    );
    if (!reportData) {
      await jobQueries.updateStatus(jobId, 'failed', {
        error: 'AI report generation returned empty result',
      });
      return;
    }

    // Persist report
    const createdReport = await reportQueries.create({
      ...reportData,
      resume_id,
      status: 'ENABLED' as const,
    });

    await jobQueries.updateStatus(jobId, 'completed', {
      result: {
        report_id: createdReport._id,
        resume_id: createdReport.resume_id,
        overallGrade: createdReport.overallGrade,
        scoreOutOf100: createdReport.scoreOutOf100,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown worker error';
    await jobQueries.updateStatus(jobId, 'failed', { error: message });
  }
}
