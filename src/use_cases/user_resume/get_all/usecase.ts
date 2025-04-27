import {
  UseCase,
  Either,
  successClass,
  UseCaseError,
} from "../../../interfaces";
import { userResumeQueries } from "../../../db";
import { IGetAllUserResumesQueryDto } from "./dto";
import { logUnexpectedUsecaseError } from "../../../logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = Either<UseCaseError, any>;

export class GetAllUserResumesUseCase
  implements UseCase<IGetAllUserResumesQueryDto, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: IGetAllUserResumesQueryDto): Promise<Response> {
    const filter = {
      search: request.search ? request.search : "",
      skip: request.skip ? request.skip : 0,
      limit: request.limit ? request.limit : undefined,
      user_id: request.user_id ? request.user_id : "",
    };

    const allUserResumes = await userResumeQueries.getResmesByUserId(filter);

    if (allUserResumes[0].paginatedResults.length == 0) {
      allUserResumes[0].totalCount.push({ count: 0 });
    }
    return successClass(allUserResumes[0]);
  }
}
