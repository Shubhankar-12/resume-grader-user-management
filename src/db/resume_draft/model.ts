import { model } from 'mongoose';
import { ResumeDraftSchema } from './schema';
import { IResumeDraftDocument } from './types';

const resumeDraftModel = model<IResumeDraftDocument>(
    'resume_draft', ResumeDraftSchema, 'resume_drafts'
);

export { resumeDraftModel };
