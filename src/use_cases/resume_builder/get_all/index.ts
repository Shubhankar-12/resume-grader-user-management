// src/use_cases/resume_builder/get_all/index.ts
import { GetAllResumeDraftsMiddleware } from './middleware';
import { GetAllResumeDraftsUseCase } from './usecase';
import { GetAllResumeDraftsController } from './controller';
const getAllResumeDraftsUseCase = new GetAllResumeDraftsUseCase();
export const getAllResumeDraftsController = new GetAllResumeDraftsController(getAllResumeDraftsUseCase);
export const getAllResumeDraftsMiddleware = new GetAllResumeDraftsMiddleware();
