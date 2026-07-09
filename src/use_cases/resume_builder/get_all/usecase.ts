// src/use_cases/resume_builder/get_all/usecase.ts
import { resumeDraftQueries } from '../../../db/queries';
import { UseCase, Either, errClass, successClass, UseCaseError } from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { InternalServerError } from './errors';
import { IGetAllResumeDraftsDto } from './dto';
type Response = Either<UseCaseError, any>;
export class GetAllResumeDraftsUseCase
implements UseCase<IGetAllResumeDraftsDto, Response> {
  @logUnexpectedUsecaseError({ level: 'error' })
  async execute(request: IGetAllResumeDraftsDto): Promise<Response> {
    try {
      const drafts = await resumeDraftQueries.getByUserId(request.user_id);
      return successClass(drafts);
    } catch (error) {
      console.error('Unexpected error in GetAllResumeDraftsUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
