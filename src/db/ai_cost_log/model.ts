import mongoose from 'mongoose';
import { aiCostLogSchema } from './schema';

export const AICostLog = mongoose.model('AICostLog', aiCostLogSchema);
