import {
  UseCase,
  Either,
  successClass,
  UseCaseError,
} from "../../../interfaces";
import { tailoredResumeQueries } from "../../../db";
import { IGetAllTailoredResumesQueryDto } from "./dto";
import { logUnexpectedUsecaseError } from "../../../logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = Either<UseCaseError, any>;

export class GetAllTailoredResumesUseCase
  implements UseCase<IGetAllTailoredResumesQueryDto, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: IGetAllTailoredResumesQueryDto): Promise<Response> {
    const filter = {
      search: request.search ? request.search : "",
      skip: request.skip ? request.skip : 0,
      limit: request.limit ? request.limit : undefined,
      user_id: request.user_id ? request.user_id : "",
    };

    const allTailoredResumes = await tailoredResumeQueries.getResmesByUserId(
      filter
    );

    if (allTailoredResumes[0].paginatedResults.length == 0) {
      allTailoredResumes[0].totalCount.push({ count: 0 });
    }
    return successClass(allTailoredResumes[0]);
  }
}
