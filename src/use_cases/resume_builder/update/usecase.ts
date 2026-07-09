// src/use_cases/resume_builder/update/usecase.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { resumeDraftQueries } from '../../../db/queries';
import { UseCase, Either, errClass, successClass, UseCaseError } from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { InternalServerError, NotFoundError } from './errors';
import { IUpdateResumeDraftDto, EDITABLE_FIELDS } from './dto';
type Response = Either<UseCaseError, any>;
export class UpdateResumeDraftUseCase
implements UseCase<IUpdateResumeDraftDto, Response> {
  @logUnexpectedUsecaseError({ level: 'error' })
  async execute(request: IUpdateResumeDraftDto): Promise<Response> {
    try {
      const patch: Record<string, any> = {};
      for (const key of EDITABLE_FIELDS) {
        if (Object.prototype.hasOwnProperty.call(request.patch ?? {}, key)) {
          patch[key] = request.patch[key];
        }
      }
      const updated = await resumeDraftQueries.update({
        resume_draft_id: request.resume_draft_id,
        ...patch,
      });
      if (!updated) return errClass(new NotFoundError());
      return successClass(updated);
    } catch (error) {
      console.error('Unexpected error in UpdateResumeDraftUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
