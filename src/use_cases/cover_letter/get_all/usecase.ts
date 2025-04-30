import {
  UseCase,
  Either,
  successClass,
  UseCaseError,
} from "../../../interfaces";
import { coverLetterQueries } from "../../../db";
import { IGetAllCoverLettersQueryDto } from "./dto";
import { logUnexpectedUsecaseError } from "../../../logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = Either<UseCaseError, any>;

export class GetAllCoverLettersUseCase
  implements UseCase<IGetAllCoverLettersQueryDto, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: IGetAllCoverLettersQueryDto): Promise<Response> {
    const filter = {
      search: request.search ? request.search : "",
      skip: request.skip ? request.skip : 0,
      limit: request.limit ? request.limit : undefined,
      user_id: request.user_id ? request.user_id : "",
    };

    const allCoverLetters = await coverLetterQueries.getCoverLetterByUserId(
      filter
    );

    if (allCoverLetters[0].paginatedResults.length == 0) {
      allCoverLetters[0].totalCount.push({ count: 0 });
    }
    return successClass(allCoverLetters[0]);
  }
}
