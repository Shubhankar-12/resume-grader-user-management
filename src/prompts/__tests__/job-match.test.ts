import { describe, it, expect } from 'vitest';
import { getResumeExtractedFields, generateResumeJobMatchReport } from '../index';
import seniorEngineer from './fixtures/golden/senior-engineer.json';

const SAMPLE_JD = `
Senior Software Engineer — Backend Platform

We are looking for a Senior Software Engineer to join our Backend Platform team.

Responsibilities:
- Design and build scalable distributed systems serving millions of users
- Lead technical design reviews and mentor junior engineers
- Collaborate with product and infrastructure teams to deliver reliable services
- Improve system observability and on-call practices

Requirements:
- 5+ years of backend software engineering experience
- Strong proficiency in Go, Python, or Java
- Experience with cloud platforms (AWS, GCP, or Azure)
- Hands-on experience with Kubernetes, Docker, and CI/CD pipelines
- Excellent communication and collaboration skills

Nice to have:
- Experience with Kafka or other event streaming systems
- Open-source contributions
- AWS or GCP certifications
`;

describe.skipIf(!process.env.RUN_AI_TESTS)('Job Match Integration Tests', () => {
  it('generates job match report for senior engineer against sample JD', async () => {
    const extracted = await getResumeExtractedFields(seniorEngineer.resumeText);
    const result = await generateResumeJobMatchReport(extracted, SAMPLE_JD);

    expect(typeof result.resumeMatchAnalysis.overallMatch).toBe('number');
    expect(result.resumeMatchAnalysis.overallMatch).toBeGreaterThanOrEqual(0);
    expect(result.resumeMatchAnalysis.overallMatch).toBeLessThanOrEqual(100);

    expect(Array.isArray(result.resumeMatchAnalysis.matchingSkills)).toBe(true);
    expect(Array.isArray(result.resumeMatchAnalysis.missingSkills)).toBe(true);
  }, 30000);

  it('generates job match report for a strongly matched candidate with high overall match', async () => {
    const extracted = await getResumeExtractedFields(seniorEngineer.resumeText);
    const result = await generateResumeJobMatchReport(extracted, SAMPLE_JD);

    // Senior engineer should have a strong match for a senior backend role
    expect(result.resumeMatchAnalysis.overallMatch).toBeGreaterThanOrEqual(60);
    expect(result.resumeMatchAnalysis.matchingSkills.length).toBeGreaterThan(0);
  }, 30000);
});
