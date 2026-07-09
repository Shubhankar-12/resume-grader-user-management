// src/use_cases/resume_builder/disable/usecase.ts
import { resumeDraftQueries } from '../../../db/queries';
import { UseCase, Either, errClass, successClass, UseCaseError } from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { InternalServerError } from './errors';
import { IDisableResumeDraftDto } from './dto';
type Response = Either<UseCaseError, any>;
export class DisableResumeDraftUseCase
implements UseCase<IDisableResumeDraftDto, Response> {
  @logUnexpectedUsecaseError({ level: 'error' })
  async execute(request: IDisableResumeDraftDto): Promise<Response> {
    try {
      const result = await resumeDraftQueries.disable(request.resume_draft_id, request.user_id);
      return successClass(result);
    } catch (error) {
      console.error('Unexpected error in DisableResumeDraftUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
