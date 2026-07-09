import { PromptExecutor } from './executor';
import { gradingV1 } from './grading/v1';
import { gradingV2Reasoning } from './grading/v2';
import { gradingV2Format } from './grading/v2-format';
import { GradingResult } from './grading/schema';
import { extractionV1 } from './extraction/v1';
import { ExtractionResult } from './extraction/schema';
import { reportV1 } from './report/v1';
import { reportV2Reasoning } from './report/v2';
import { reportV2Format } from './report/v2-format';
import { ReportResult } from './report/schema';
import { tailoringV1 } from './tailoring/v1';
import { tailoringV2Reasoning } from './tailoring/v2';
import { tailoringV2Format } from './tailoring/v2-format';
import { TailoringResult } from './tailoring/schema';
import { jobMatchV1 } from './job-match/v1';
import { JobMatchResult } from './job-match/schema';
import { coverLetterV1 } from './cover-letter/v1';
import { CoverLetterResult } from './cover-letter/schema';
import { buildProjectAnalysisTemplate } from './project-analysis/v1';
import { ProjectAnalysisResult } from './project-analysis/schema';
import { improveBulletV1, summaryV1, skillsV1, polishDescriptionV1 } from './resume-assist/v1';
import {
  ImprovedBulletResult,
  ResumeSummaryResult,
  SkillSuggestionResult,
  PolishDescriptionResult,
} from './resume-assist/schema';
import { getTaskConfig } from './config';

const executor = new PromptExecutor();

export async function improveResumeBullet(bullet: string, context: string) {
  const result = await executor.execute({
    task: 'resumeAssist',
    input: { bullet, context },
    template: improveBulletV1,
    schema: ImprovedBulletResult,
    cacheKey: 'improve:' + bullet + '|' + context,
  });
  return result.data;
}

export async function generateResumeSummary(resumeJson: string) {
  const result = await executor.execute({
    task: 'resumeAssist',
    input: { resume: resumeJson },
    template: summaryV1,
    schema: ResumeSummaryResult,
    cacheKey: 'summary:' + resumeJson,
  });
  return result.data;
}

export async function suggestResumeSkills(
    role: string,
    experience: string,
    existing: string
) {
  const result = await executor.execute({
    task: 'resumeAssist',
    input: { role, experience, existing },
    template: skillsV1,
    schema: SkillSuggestionResult,
    cacheKey: 'skills:' + role + '|' + experience + '|' + existing,
  });
  return result.data;
}

export async function polishResumeDescription(text: string, context: string) {
  const result = await executor.execute({
    task: 'resumeAssist',
    input: { text, context },
    template: polishDescriptionV1,
    schema: PolishDescriptionResult,
    cacheKey: 'polish:' + text + '|' + context,
  });
  return result.data;
}

export async function getResumeScoreAndSuggestions(text: string) {
  const config = getTaskConfig('grading');
  if (config.useChainOfThought) {
    const result = await executor.executeCoT({
      task: 'grading',
      input: { resumeText: text },
      reasoningTemplate: gradingV2Reasoning,
      formatTemplate: gradingV2Format,
      schema: GradingResult,
      cacheKey: text,
    });
    return result.data;
  }
  const result = await executor.execute({
    task: 'grading',
    input: { resumeText: text },
    template: gradingV1,
    schema: GradingResult,
    cacheKey: text,
  });
  return result.data;
}

export async function getResumeExtractedFields(text: string) {
  const result = await executor.execute({
    task: 'extraction',
    input: { resumeText: text },
    template: extractionV1,
    schema: ExtractionResult,
    cacheKey: text,
  });
  return result.data;
}

export async function generateResumeReportFromExtractedText(extractedFields: any) {
  const config = getTaskConfig('report');
  const inputStr = JSON.stringify(extractedFields);
  if (config.useChainOfThought) {
    const result = await executor.executeCoT({
      task: 'report',
      input: { extractedFields: inputStr },
      reasoningTemplate: reportV2Reasoning,
      formatTemplate: reportV2Format,
      schema: ReportResult,
      cacheKey: inputStr,
    });
    return result.data;
  }
  const result = await executor.execute({
    task: 'report',
    input: { extractedFields: inputStr },
    template: reportV1,
    schema: ReportResult,
    cacheKey: inputStr,
  });
  return result.data;
}

export async function generateTailoredResume(extractedFields: any, jobDescription: string) {
  const config = getTaskConfig('tailoring');
  const inputStr = JSON.stringify(extractedFields) + jobDescription;
  if (config.useChainOfThought) {
    const result = await executor.executeCoT({
      task: 'tailoring',
      input: { extractedFields: JSON.stringify(extractedFields), jobDescription },
      reasoningTemplate: tailoringV2Reasoning,
      formatTemplate: tailoringV2Format,
      schema: TailoringResult,
      cacheKey: inputStr,
    });
    return result.data;
  }
  const result = await executor.execute({
    task: 'tailoring',
    input: { extractedFields: JSON.stringify(extractedFields), jobDescription },
    template: tailoringV1,
    schema: TailoringResult,
    cacheKey: inputStr,
  });
  return result.data;
}

export async function generateResumeJobMatchReport(extractedFields: any, jobDescription: string) {
  const result = await executor.execute({
    task: 'jobMatch',
    input: { extractedFields: JSON.stringify(extractedFields), jobDescription },
    template: jobMatchV1,
    schema: JobMatchResult,
    cacheKey: JSON.stringify(extractedFields) + jobDescription,
  });
  return result.data;
}

export async function generateResumeCoverLetterFromExtractedText(
  extractedResumeData: any, jobDescription: string, role: string, company: string
) {
  const result = await executor.execute({
    task: 'coverLetter',
    input: { extractedFields: JSON.stringify(extractedResumeData), jobDescription, role, company },
    template: coverLetterV1,
    schema: CoverLetterResult,
    cacheKey: JSON.stringify(extractedResumeData) + jobDescription + role + company,
  });
  return result.data;
}

export async function generateCoverLetterStreaming(
  extractedResumeData: any,
  jobDescription: string,
  role: string,
  company: string,
  jobId: string
) {
  const result = await executor.executeStream({
    task: 'coverLetter',
    input: {
      extractedFields: JSON.stringify(extractedResumeData),
      jobDescription,
      role,
      company,
    },
    template: coverLetterV1,
    schema: CoverLetterResult,
    cacheKey: JSON.stringify(extractedResumeData) + jobDescription + role + company,
    jobId,
  });
  return result.data;
}

export async function generateResumeProjectAnalysis(
  role: string,
  projects: {
    id: number; name: string; description: string; stars: number;
    language: string; languageColor: string; topics: string[];
    updated_at: string; additional_comments?: string; readme?: string;
  }[]
) {
  const projectDescriptions = projects
    .map((project, index) => `Project ${index + 1}:\n- ID: ${project.id}\n- Name: ${project.name}\n- Description: ${project.description || 'N/A'}\n- Stars: ${project.stars}\n- Language: ${project.language}\n- Topics: ${project.topics?.join(', ') || 'None'}\n- Additional Comments: ${project.additional_comments || 'None'}\n${project.readme ? `- Readme Excerpt: ${project.readme.substring(0, 500)}${project.readme.length > 500 ? '...' : ''}` : '- Readme: None'}\n- Last Updated: ${project.updated_at}`)
    .join('\n\n');

  const template = buildProjectAnalysisTemplate(role, projectDescriptions);
  const result = await executor.execute({
    task: 'projectAnalysis',
    input: {},
    template,
    schema: ProjectAnalysisResult,
    cacheKey: role + projectDescriptions,
  });

  const data = result.data;
  if (Array.isArray(data)) return data;
  if ('projects' in data) return (data as { projects: unknown[] }).projects;
  return data;
}
