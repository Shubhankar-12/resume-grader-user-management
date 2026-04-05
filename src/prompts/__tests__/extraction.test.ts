import { describe, it, expect } from 'vitest';
import { getResumeExtractedFields } from '../index';
import seniorEngineer from './fixtures/golden/senior-engineer.json';
import executive from './fixtures/golden/executive.json';
import careerChanger from './fixtures/golden/career-changer.json';
import juniorDev from './fixtures/golden/junior-dev.json';
import freshGraduate from './fixtures/golden/fresh-graduate.json';

describe.skipIf(!process.env.RUN_AI_TESTS)('Extraction Integration Tests', () => {
  const goldenFixtures = [
    { label: 'senior engineer', fixture: seniorEngineer },
    { label: 'executive', fixture: executive },
    { label: 'career changer', fixture: careerChanger },
    { label: 'junior dev', fixture: juniorDev },
    { label: 'fresh graduate', fixture: freshGraduate },
  ];

  for (const { label, fixture } of goldenFixtures) {
    it(`extracts fields from ${label} resume`, async () => {
      const result = await getResumeExtractedFields(fixture.resumeText);

      expect(typeof result.name).toBe('string');
      expect(result.name.trim().length).toBeGreaterThan(0);

      expect(Array.isArray(result.skills)).toBe(true);
      expect(result.skills.length).toBeGreaterThan(0);

      expect(Array.isArray(result.experience)).toBe(true);
      expect(result.experience.length).toBeGreaterThan(0);

      for (const exp of result.experience) {
        expect(typeof exp.companyName).toBe('string');
        expect(exp.companyName.trim().length).toBeGreaterThan(0);
        expect(typeof exp.role).toBe('string');
        expect(exp.role.trim().length).toBeGreaterThan(0);
      }
    }, 30000);
  }
});
