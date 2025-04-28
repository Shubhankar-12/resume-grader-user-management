import {
  UseCase,
  Either,
  successClass,
  ResponseLocalAuth,
  UseCaseError,
  errClass,
} from "../../../interfaces";
import { IGetTailoredResumeDto } from "./dto";
import { logUnexpectedUsecaseError } from "../../../logger";
import { tailoredResumeQueries } from "../../../db/queries";
import { TailoredResumeNotFoundError } from "./error";

type Response = Either<UseCaseError, any>;
type Request = {
  request: IGetTailoredResumeDto;
  auth: ResponseLocalAuth;
};

export class GetTailoredResumeByIdUseCase
  implements UseCase<Request, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute({ request, auth }: Request): Promise<Response> {
    const TailoredResume = await tailoredResumeQueries.getTailoredResumebyId(
      request
    );
    if (TailoredResume.length == 0) {
      return errClass(new TailoredResumeNotFoundError("tailored_resume_id"));
    }
    return successClass(TailoredResume[0]);
  }
}
