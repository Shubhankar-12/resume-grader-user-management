// src/use_cases/resume_builder/disable/index.ts
import { DisableResumeDraftMiddleware } from './middleware';
import { DisableResumeDraftUseCase } from './usecase';
import { DisableResumeDraftController } from './controller';
const disableResumeDraftUseCase = new DisableResumeDraftUseCase();
export const disableResumeDraftController = new DisableResumeDraftController(disableResumeDraftUseCase);
export const disableResumeDraftMiddleware = new DisableResumeDraftMiddleware();
