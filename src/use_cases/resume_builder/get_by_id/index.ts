// src/use_cases/resume_builder/get_by_id/index.ts
import { GetResumeDraftByIdMiddleware } from './middleware';
import { GetResumeDraftByIdUseCase } from './usecase';
import { GetResumeDraftByIdController } from './controller';
const getResumeDraftByIdUseCase = new GetResumeDraftByIdUseCase();
export const getResumeDraftByIdController = new GetResumeDraftByIdController(getResumeDraftByIdUseCase);
export const getResumeDraftByIdMiddleware = new GetResumeDraftByIdMiddleware();
