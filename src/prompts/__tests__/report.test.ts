import { describe, it, expect } from 'vitest';
import { getResumeExtractedFields, generateResumeReportFromExtractedText } from '../index';
import seniorEngineer from './fixtures/golden/senior-engineer.json';
import executive from './fixtures/golden/executive.json';

describe.skipIf(!process.env.RUN_AI_TESTS)('Report Integration Tests', () => {
  it('generates report for senior engineer within expected score range', async () => {
    const extracted = await getResumeExtractedFields(seniorEngineer.resumeText);
    const result = await generateResumeReportFromExtractedText(extracted);

    expect(result.scoreOutOf100).toBeGreaterThanOrEqual(seniorEngineer.expectedGradingScore.min);
    expect(result.scoreOutOf100).toBeLessThanOrEqual(seniorEngineer.expectedGradingScore.max);

    expect(typeof result.overallGrade).toBe('string');
    expect(result.overallGrade.trim().length).toBeGreaterThan(0);

    expect(Array.isArray(result.strengths)).toBe(true);
    expect(result.strengths.length).toBeGreaterThan(0);

    expect(Array.isArray(result.areasForImprovement)).toBe(true);
    expect(result.areasForImprovement.length).toBeGreaterThan(0);
  }, 30000);

  it('generates report for executive within expected score range', async () => {
    const extracted = await getResumeExtractedFields(executive.resumeText);
    const result = await generateResumeReportFromExtractedText(extracted);

    expect(result.scoreOutOf100).toBeGreaterThanOrEqual(executive.expectedGradingScore.min);
    expect(result.scoreOutOf100).toBeLessThanOrEqual(executive.expectedGradingScore.max);

    expect(typeof result.overallGrade).toBe('string');
    expect(result.overallGrade.trim().length).toBeGreaterThan(0);

    expect(Array.isArray(result.strengths)).toBe(true);
    expect(result.strengths.length).toBeGreaterThan(0);

    expect(Array.isArray(result.areasForImprovement)).toBe(true);
    expect(result.areasForImprovement.length).toBeGreaterThan(0);
  }, 30000);
});
