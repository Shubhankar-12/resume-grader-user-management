import { describe, it, expect } from 'vitest';
import { getCost, creditCosts } from '../creditCosts';

describe('creditCosts', () => {
  it('returns declared cost for each action', () => {
    expect(getCost('resume_grade')).toBe(3);
    expect(getCost('cover_letter')).toBe(1);
    expect(getCost('tailored_resume')).toBe(2);
    expect(getCost('job_match')).toBe(1);
    expect(getCost('project_analysis')).toBe(1);
    expect(getCost('resume_ai_assist')).toBe(1);
  });
  it('map contains exactly 6 actions', () => {
    expect(Object.keys(creditCosts)).toHaveLength(6);
  });
});
