import { describe, it, expect } from 'vitest';
import { ResumeDraftSchema } from '../schema';
import { SECTION_KEYS, TEMPLATE_IDS } from '../types';

describe('resume_draft schema', () => {
  it('exposes the canonical section keys and template ids', () => {
    expect(SECTION_KEYS).toEqual([
      'summary', 'skills', 'experience', 'education',
      'projects', 'certifications', 'languages', 'interests',
    ]);
    expect(TEMPLATE_IDS).toEqual(['classic', 'modern', 'compact']);
  });

  it('defines the core paths with the soft-delete field', () => {
    const paths = Object.keys(ResumeDraftSchema.paths);
    expect(paths).toEqual(expect.arrayContaining([
      'user_id', 'title', 'template_id', 'accent_color',
      'summary', 'skills', 'experience', 'education',
      'section_order', 'status_field',
    ]));
  });
});
