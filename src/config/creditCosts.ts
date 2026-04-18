export type AIAction =
  | 'resume_grade'
  | 'cover_letter'
  | 'tailored_resume'
  | 'job_match'
  | 'project_analysis';

export const creditCosts: Record<AIAction, number> = {
  resume_grade: 3,
  cover_letter: 1,
  tailored_resume: 2,
  job_match: 1,
  project_analysis: 1,
};

export function getCost(action: AIAction): number {
  return creditCosts[action];
}
