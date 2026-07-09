// src/use_cases/resume_builder/create/index.ts
import { CreateResumeDraftMiddleware } from './middleware';
import { CreateResumeDraftUseCase } from './usecase';
import { CreateResumeDraftController } from './controller';

const createResumeDraftUseCase = new CreateResumeDraftUseCase();
export const createResumeDraftController = new CreateResumeDraftController(createResumeDraftUseCase);
export const createResumeDraftMiddleware = new CreateResumeDraftMiddleware();
