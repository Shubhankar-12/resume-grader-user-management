import {
  UseCase,
  Either,
  successClass,
  ResponseLocalAuth,
  UseCaseError,
  errClass,
} from "../../../interfaces";
import { IGetReportDto } from "./dto";
import { logUnexpectedUsecaseError } from "../../../logger";
import { reportQueries } from "../../../db/queries";
import { ReportNotFoundError } from "./error";

type Response = Either<UseCaseError, any>;
type Request = {
  request: IGetReportDto;
  auth: ResponseLocalAuth;
};

export class GetReportByResumeIdUseCase implements UseCase<Request, Response> {
  @logUnexpectedUsecaseError({ level: "error" })
  async execute({ request, auth }: Request): Promise<Response> {
    const Report = await reportQueries.getReportByResumeId(request.resume_id);
    if (Report.length == 0) {
      return errClass(new ReportNotFoundError("resume_id"));
    }
    return successClass(Report[0]);
  }
}
