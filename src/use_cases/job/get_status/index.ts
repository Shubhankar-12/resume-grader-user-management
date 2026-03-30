import { GetJobStatusMiddleware } from './middleware';
import { GetJobStatusUseCase } from './usecase';
import { GetJobStatusController } from './controller';

const getJobStatusUseCase = new GetJobStatusUseCase();
export const getJobStatusController = new GetJobStatusController(
    getJobStatusUseCase
);
export const getJobStatusMiddleware = new GetJobStatusMiddleware();
