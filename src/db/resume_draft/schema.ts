import { Schema } from 'mongoose';
import { SECTION_KEYS, TEMPLATE_IDS } from './types';

const LinkSchema = new Schema(
    { label: { type: String, default: '' }, url: { type: String, default: '' } },
    { _id: false }
);

const SkillItemSchema = new Schema(
    {
      name: { type: String, default: '' },
      level: {
        type: String,
        enum: ['expert', 'proficient', 'intermediate', 'beginner'],
        required: false,
      },
    },
    { _id: false }
);

const SkillGroupSchema = new Schema(
    {
      id: { type: String, required: true },
      category: { type: String, default: '' },
      skills: { type: [SkillItemSchema], default: [] },
    },
    { _id: false }
);

const LanguageItemSchema = new Schema(
    {
      id: { type: String, required: true },
      name: { type: String, default: '' },
      level: {
        type: String,
        enum: ['native', 'fluent', 'professional', 'intermediate', 'basic'],
        required: false,
      },
    },
    { _id: false }
);

const ExperienceSchema = new Schema(
    {
      id: { type: String, required: true },
      role: { type: String, default: '' },
      companyName: { type: String, default: '' },
      location: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' },
      isPresent: { type: Boolean, default: false },
      bullets: { type: [String], default: [] },
      description: { type: String, default: '' },
    },
    { _id: false }
);

const EducationSchema = new Schema(
    {
      id: { type: String, required: true },
      degree: { type: String, default: '' },
      subject: { type: String, default: '' },
      schoolName: { type: String, default: '' },
      location: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' },
      gpa: { type: String, default: '' },
      honors: { type: String, default: '' },
      coursework: { type: [String], default: [] },
    },
    { _id: false }
);

const ProjectSchema = new Schema(
    {
      id: { type: String, required: true },
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      technologies: { type: [String], default: [] },
      links: { type: [LinkSchema], default: [] },
    },
    { _id: false }
);

const CertificationSchema = new Schema(
    {
      id: { type: String, required: true },
      name: { type: String, default: '' },
      issuer: { type: String, default: '' },
      date: { type: String, default: '' },
      url: { type: String, default: '' },
    },
    { _id: false }
);

const AwardSchema = new Schema(
    {
      id: { type: String, required: true },
      name: { type: String, default: '' },
      issuer: { type: String, default: '' },
      date: { type: String, default: '' },
      description: { type: String, default: '' },
    },
    { _id: false }
);

const PublicationSchema = new Schema(
    {
      id: { type: String, required: true },
      title: { type: String, default: '' },
      publisher: { type: String, default: '' },
      date: { type: String, default: '' },
      url: { type: String, default: '' },
      description: { type: String, default: '' },
    },
    { _id: false }
);

const VolunteerSchema = new Schema(
    {
      id: { type: String, required: true },
      role: { type: String, default: '' },
      organization: { type: String, default: '' },
      location: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' },
      isPresent: { type: Boolean, default: false },
      description: { type: String, default: '' },
    },
    { _id: false }
);

const ActivitySchema = new Schema(
    {
      id: { type: String, required: true },
      title: { type: String, default: '' },
      organization: { type: String, default: '' },
      date: { type: String, default: '' },
      description: { type: String, default: '' },
    },
    { _id: false }
);

const ResumeDraftSchema = new Schema(
    {
      user_id: { type: String, required: true },
      title: { type: String, required: true, default: 'Untitled resume' },
      template_id: { type: String, enum: TEMPLATE_IDS, required: true, default: 'classic' },
      accent_color: { type: String, required: true, default: 'accent' },
      basics: {
        name: { type: String, default: '' },
        headline: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        links: { type: [LinkSchema], default: [] },
        photoUrl: { type: String, default: '' },
      },
      summary: { type: String, default: '' },
      skills: { type: [String], default: [] },
      skillGroups: { type: [SkillGroupSchema], default: [] },
      languages: { type: [String], default: [] },
      languageItems: { type: [LanguageItemSchema], default: [] },
      interests: { type: [String], default: [] },
      experience: { type: [ExperienceSchema], default: [] },
      education: { type: [EducationSchema], default: [] },
      projects: { type: [ProjectSchema], default: [] },
      certifications: { type: [CertificationSchema], default: [] },
      awards: { type: [AwardSchema], default: [] },
      publications: { type: [PublicationSchema], default: [] },
      volunteer: { type: [VolunteerSchema], default: [] },
      activities: { type: [ActivitySchema], default: [] },
      section_order: { type: [String], default: [...SECTION_KEYS] },
      status_field: {
        type: String, enum: ['ENABLED', 'DISABLED'], required: true, default: 'ENABLED',
      },
    },
    { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' } }
);

ResumeDraftSchema.index({ user_id: 1, status_field: 1, updated_on: -1 });

export { ResumeDraftSchema };
