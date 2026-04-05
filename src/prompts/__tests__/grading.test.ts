import { describe, it, expect } from 'vitest';
import { getResumeScoreAndSuggestions } from '../index';
import seniorEngineer from './fixtures/golden/senior-engineer.json';
import executive from './fixtures/golden/executive.json';
import careerChanger from './fixtures/golden/career-changer.json';
import juniorDev from './fixtures/golden/junior-dev.json';
import freshGraduate from './fixtures/golden/fresh-graduate.json';
import strongTier from './fixtures/synthetic/strong-tier.json';
import averageTier from './fixtures/synthetic/average-tier.json';
import weakTier from './fixtures/synthetic/weak-tier.json';

describe.skipIf(!process.env.RUN_AI_TESTS)('Grading Integration Tests', () => {
  describe('Golden fixtures', () => {
    it('scores senior engineer in expected range', async () => {
      const result = await getResumeScoreAndSuggestions(seniorEngineer.resumeText);
      expect(result.gradingScore).toBeGreaterThanOrEqual(seniorEngineer.expectedGradingScore.min);
      expect(result.gradingScore).toBeLessThanOrEqual(seniorEngineer.expectedGradingScore.max);
      expect(result.suggestions.length).toBeGreaterThanOrEqual(seniorEngineer.expectedSuggestionsMin);
    }, 30000);

    it('scores executive in expected range', async () => {
      const result = await getResumeScoreAndSuggestions(executive.resumeText);
      expect(result.gradingScore).toBeGreaterThanOrEqual(executive.expectedGradingScore.min);
      expect(result.gradingScore).toBeLessThanOrEqual(executive.expectedGradingScore.max);
      expect(result.suggestions.length).toBeGreaterThanOrEqual(executive.expectedSuggestionsMin);
    }, 30000);

    it('scores career changer in expected range', async () => {
      const result = await getResumeScoreAndSuggestions(careerChanger.resumeText);
      expect(result.gradingScore).toBeGreaterThanOrEqual(careerChanger.expectedGradingScore.min);
      expect(result.gradingScore).toBeLessThanOrEqual(careerChanger.expectedGradingScore.max);
      expect(result.suggestions.length).toBeGreaterThanOrEqual(careerChanger.expectedSuggestionsMin);
    }, 30000);

    it('scores junior dev in expected range', async () => {
      const result = await getResumeScoreAndSuggestions(juniorDev.resumeText);
      expect(result.gradingScore).toBeGreaterThanOrEqual(juniorDev.expectedGradingScore.min);
      expect(result.gradingScore).toBeLessThanOrEqual(juniorDev.expectedGradingScore.max);
      expect(result.suggestions.length).toBeGreaterThanOrEqual(juniorDev.expectedSuggestionsMin);
    }, 30000);

    it('scores fresh graduate in expected range', async () => {
      const result = await getResumeScoreAndSuggestions(freshGraduate.resumeText);
      expect(result.gradingScore).toBeGreaterThanOrEqual(freshGraduate.expectedGradingScore.min);
      expect(result.gradingScore).toBeLessThanOrEqual(freshGraduate.expectedGradingScore.max);
      expect(result.suggestions.length).toBeGreaterThanOrEqual(freshGraduate.expectedSuggestionsMin);
    }, 30000);
  });

  describe('Strong tier', () => {
    it.each((strongTier as Array<{ resumeText: string; tier: string }>).map((r, i) => [i, r] as [number, { resumeText: string; tier: string }]))(
      'resume %i scores in range 75-95',
      async (_idx: number, resume: { resumeText: string; tier: string }) => {
        const result = await getResumeScoreAndSuggestions(resume.resumeText);
        expect(result.gradingScore).toBeGreaterThanOrEqual(75);
        expect(result.gradingScore).toBeLessThanOrEqual(95);
      },
      30000
    );
  });

  describe('Average tier', () => {
    it.each((averageTier as Array<{ resumeText: string; tier: string }>).map((r, i) => [i, r] as [number, { resumeText: string; tier: string }]))(
      'resume %i scores in range 50-74',
      async (_idx: number, resume: { resumeText: string; tier: string }) => {
        const result = await getResumeScoreAndSuggestions(resume.resumeText);
        expect(result.gradingScore).toBeGreaterThanOrEqual(50);
        expect(result.gradingScore).toBeLessThanOrEqual(74);
      },
      30000
    );
  });

  describe('Weak tier', () => {
    it.each((weakTier as Array<{ resumeText: string; tier: string }>).map((r, i) => [i, r] as [number, { resumeText: string; tier: string }]))(
      'resume %i scores in range 20-49',
      async (_idx: number, resume: { resumeText: string; tier: string }) => {
        const result = await getResumeScoreAndSuggestions(resume.resumeText);
        expect(result.gradingScore).toBeGreaterThanOrEqual(20);
        expect(result.gradingScore).toBeLessThanOrEqual(49);
      },
      30000
    );
  });
});
