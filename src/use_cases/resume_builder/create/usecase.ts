// src/use_cases/resume_builder/create/usecase.ts
import { resumeDraftQueries, extractedResumeQueries } from '../../../db/queries';
import { UseCase, Either, errClass, successClass, UseCaseError } from '../../../interfaces';
import { logUnexpectedUsecaseError } from '../../../logger';
import { InternalServerError } from './errors';
import { ICreateResumeDraftDto } from './dto';
import { mapExtractedToDraft } from '../mapExtractedToDraft';

type Response = Either<UseCaseError, any>;

export class CreateResumeDraftUseCase
implements UseCase<ICreateResumeDraftDto, Response> {
  @logUnexpectedUsecaseError({ level: 'error' })
  async execute(request: ICreateResumeDraftDto): Promise<Response> {
    try {
      let seeded = {};
      if (request.seed_from_resume_id) {
        const rows = await extractedResumeQueries.getExtractedResumebyResumeId({
          resume_id: request.seed_from_resume_id,
        });
        const extracted = Array.isArray(rows) ? rows[0] : rows;
        if (extracted) seeded = mapExtractedToDraft(extracted);
      }
      const draft = await resumeDraftQueries.create({
        user_id: request.user_id,
        title: request.title,
        template_id: request.template_id,
        ...seeded,
      });
      return successClass(draft);
    } catch (error) {
      console.error('Unexpected error in CreateResumeDraftUseCase:', error);
      return errClass(new InternalServerError());
    }
  }
}
