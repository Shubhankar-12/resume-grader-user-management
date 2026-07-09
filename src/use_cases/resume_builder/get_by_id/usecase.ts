// src/use_cases/resume_builder/get_by_id/usecase.ts
import { resumeDraftQueries } from '../../../db/queries';
import { UseCase, Either, errClass, successClass, UseCaseError } from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { InternalServerError, NotFoundError } from './errors';
import { IGetResumeDraftByIdDto } from './dto';
type Response = Either<UseCaseError, any>;
export class GetResumeDraftByIdUseCase
implements UseCase<IGetResumeDraftByIdDto, Response> {
  @logUnexpectedUsecaseError({ level: 'error' })
  async execute(request: IGetResumeDraftByIdDto): Promise<Response> {
    try {
      const draft = await resumeDraftQueries.getById(request.resume_draft_id);
      if (!draft) return errClass(new NotFoundError());
      return successClass(draft);
    } catch (error) {
      console.error('Unexpected error in GetResumeDraftByIdUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
