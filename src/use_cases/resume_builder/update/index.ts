// src/use_cases/resume_builder/update/index.ts
import { UpdateResumeDraftMiddleware } from './middleware';
import { UpdateResumeDraftUseCase } from './usecase';
import { UpdateResumeDraftController } from './controller';
const updateResumeDraftUseCase = new UpdateResumeDraftUseCase();
export const updateResumeDraftController = new UpdateResumeDraftController(updateResumeDraftUseCase);
export const updateResumeDraftMiddleware = new UpdateResumeDraftMiddleware();
