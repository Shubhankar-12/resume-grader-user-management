import { describe, it, expect } from 'vitest';
import { mapExtractedToDraft } from '../mapExtractedToDraft';

describe('mapExtractedToDraft', () => {
  it('maps contact, summary, skills, and experience.tasks -> bullets', () => {
    const draft = mapExtractedToDraft({
      name: 'Ada', email: 'ada@x.com', phone: '123', location: 'London',
      summary: 'Engineer', category: 'Software Engineer',
      skills: ['C++', 'Rust'],
      experience: [{
        companyName: 'Acme', role: 'Dev', location: 'Remote',
        startDate: '2020', endDate: '2022', isPresent: false,
        tasks: ['Built X', 'Shipped Y'], description: 'desc',
      }],
      education: [{ schoolName: 'MIT', degree: 'BSc', subject: 'CS', location: 'US', startDate: '2016', endDate: '2020' }],
    });

    expect(draft.basics).toMatchObject({ name: 'Ada', email: 'ada@x.com', headline: 'Software Engineer' });
    expect(draft.summary).toBe('Engineer');
    expect(draft.skills).toEqual(['C++', 'Rust']);
    expect(draft.experience?.[0]).toMatchObject({ companyName: 'Acme', role: 'Dev', bullets: ['Built X', 'Shipped Y'] });
    expect(typeof draft.experience?.[0].id).toBe('string');
    expect(draft.education?.[0]).toMatchObject({ schoolName: 'MIT', degree: 'BSc' });
  });

  it('is defensive against missing arrays', () => {
    const draft = mapExtractedToDraft({ name: 'Bob' });
    expect(draft.basics?.name).toBe('Bob');
    expect(draft.experience).toEqual([]);
    expect(draft.skills).toEqual([]);
  });
});
