import { model } from 'mongoose';
import { ApplicationSchema } from './schema';
import { IApplicationDocument } from './types';

const applicationModel = model<IApplicationDocument>(
    'application',
    ApplicationSchema,
    'applications'
);

export { applicationModel };
