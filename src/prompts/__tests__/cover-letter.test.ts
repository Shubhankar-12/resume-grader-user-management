import { describe, it, expect } from 'vitest';
import { getResumeExtractedFields, generateResumeCoverLetterFromExtractedText } from '../index';
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
`;

describe.skipIf(!process.env.RUN_AI_TESTS)('Cover Letter Integration Tests', () => {
  it('generates cover letter for senior engineer with correct word count', async () => {
    const extracted = await getResumeExtractedFields(seniorEngineer.resumeText);
    const result = await generateResumeCoverLetterFromExtractedText(
      extracted,
      SAMPLE_JD,
      'Senior Software Engineer',
      'TechCorp Inc.'
    );

    expect(typeof result.cover_letter).toBe('string');
    const wordCount = result.cover_letter.trim().split(/\s+/).length;
    expect(wordCount).toBeGreaterThanOrEqual(100);
    expect(wordCount).toBeLessThanOrEqual(300);

    expect(typeof result.cover_letter_summary).toBe('string');
    expect(result.cover_letter_summary.trim().length).toBeGreaterThan(0);
  }, 30000);
});
