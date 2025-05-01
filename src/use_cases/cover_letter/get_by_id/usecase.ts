import {
  UseCase,
  Either,
  successClass,
  ResponseLocalAuth,
  UseCaseError,
  errClass,
} from "../../../interfaces";
import { IGetCoverLetterDto } from "./dto";
import { logUnexpectedUsecaseError } from "../../../logger";
import { coverLetterQueries } from "../../../db/queries";
import { CoverLetterNotFoundError } from "./error";

type Response = Either<UseCaseError, any>;
type Request = {
  request: IGetCoverLetterDto;
  auth: ResponseLocalAuth;
};

export class GetCoverLetterByIdUseCase implements UseCase<Request, Response> {
  @logUnexpectedUsecaseError({ level: "error" })
  async execute({ request, auth }: Request): Promise<Response> {
    const CoverLetter = await coverLetterQueries.getCoverLetterbyId(request);

    if (CoverLetter.length == 0) {
      return errClass(new CoverLetterNotFoundError("tailored_resume_id"));
    }
    return successClass(CoverLetter[0]);
  }
}
