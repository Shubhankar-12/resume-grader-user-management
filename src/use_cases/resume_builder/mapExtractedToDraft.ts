/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomUUID } from 'crypto';
import { IResumeDraft } from '../../db/resume_draft/types';

const arr = (v: any): any[] => (Array.isArray(v) ? v : []);
const str = (v: any): string => (typeof v === 'string' ? v : '');
const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const bulletsToHtml = (bullets: string[]): string =>
  bullets.length ? `<ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : '';

export function mapExtractedToDraft(extracted: any): Partial<IResumeDraft> {
  const e = extracted ?? {};
  return {
    basics: {
      name: str(e.name),
      headline: str(e.category),
      email: str(e.email),
      phone: str(e.phone),
      location: str(e.location),
      links: [],
      photoUrl: '',
    },
    summary: str(e.summary),
    skills: arr(e.skills).map(str).filter(Boolean),
    skillGroups: (() => {
      const names = arr(e.skills).map(str).filter(Boolean);
      return names.length
        ? [{ id: randomUUID(), category: 'Skills', skills: names.map((n) => ({ name: n })) }]
        : [];
    })(),
    languages: arr(e.languages).map(str).filter(Boolean),
    languageItems: arr(e.languages)
        .map(str)
        .filter(Boolean)
        .map((n) => ({ id: randomUUID(), name: n })),
    interests: arr(e.interests).map(str).filter(Boolean),
    experience: arr(e.experience).map((x: any) => {
      const bullets = arr(x.tasks).map(str).filter(Boolean);
      return {
        id: randomUUID(),
        role: str(x.role),
        companyName: str(x.companyName),
        location: str(x.location),
        startDate: str(x.startDate),
        endDate: str(x.endDate),
        isPresent: !!x.isPresent,
        bullets,
        description: bulletsToHtml(bullets) || str(x.description),
      };
    }),
    education: arr(e.education).map((x: any) => ({
      id: randomUUID(),
      degree: str(x.degree),
      subject: str(x.subject),
      schoolName: str(x.schoolName),
      location: str(x.location),
      startDate: str(x.startDate),
      endDate: str(x.endDate),
      gpa: '',
      honors: '',
      coursework: [],
    })),
    projects: arr(e.projects).map((x: any) => ({
      id: randomUUID(),
      title: str(x.title),
      description: str(x.description),
      technologies: arr(x.technologies).map(str).filter(Boolean),
      links: [],
    })),
    certifications: arr(e.certifications)
        .map((x: any) => (typeof x === 'string' ? { name: x } : x))
        .map((x: any) => ({
          id: randomUUID(),
          name: str(x.name),
          issuer: str(x.issuer),
          date: str(x.date),
          url: str(x.url),
        })),
  };
}
