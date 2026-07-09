export type AIAction =
  | 'resume_grade'
  | 'cover_letter'
  | 'tailored_resume'
  | 'job_match'
  | 'project_analysis'
  | 'resume_ai_assist';

export const creditCosts: Record<AIAction, number> = {
  resume_grade: 3,
  cover_letter: 1,
  tailored_resume: 2,
  job_match: 1,
  project_analysis: 1,
  resume_ai_assist: 1,
};

export function getCost(action: AIAction): number {
  return creditCosts[action];
}
