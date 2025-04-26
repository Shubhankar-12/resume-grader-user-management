import { model } from 'mongoose';
import { LoginSchema } from './schema';
import { ILoginDocument } from './types';

const loginModel = model<ILoginDocument>(
    'login',
    LoginSchema,
    'login'
);

export { loginModel };
