import { extractedResumeQueries, tailoredResumeQueries } from "../../../db";
import { generateTailoredResume } from "../../../helpers/resumeAnalyzerAI";
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from "../../../interfaces";
import { logUnexpectedUsecaseError } from "../../../logger";
import { ResumeNotFoundError } from "./errors";
import { ICreateTailoredResumeDto } from "./dto";
import {
  TailoredResumeAlreadyExistsError,
  ExtractedResumeNotFoundError,
  ResumeExtractionFailedError,
} from "./errors";
import { InternalServerError } from "../../user_resume/create/errors";

type Response = Either<UseCaseError, any>;

export class CreateTailoredResumeUseCase
  implements UseCase<ICreateTailoredResumeDto, Response>
{
  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: ICreateTailoredResumeDto): Promise<Response> {
    try {
      const existingResume =
        await extractedResumeQueries.getExtractedResumebyResumeId(request);

      if (existingResume.length == 0) {
        return errClass(
          new ResumeNotFoundError(request.resume_id, "resume_id")
        );
      }

      const createTailoredResumeData = await generateTailoredResume(
        existingResume[0],
        request.resume_id
      );
      const createdTailoredResume = await tailoredResumeQueries.create({
        ...createTailoredResumeData,
        resume_id: request.resume_id,
        job_description: request.job_description,
      });
      if (!createdTailoredResume) {
        return errClass(new InternalServerError());
      }
      return successClass({
        resume_id: request.resume_id,
        tailored_resume_id: createdTailoredResume._id,
        job_description: createdTailoredResume.job_description,
        category: createdTailoredResume.category,
        name: createdTailoredResume.name,
        summary: createdTailoredResume.summary,
        email: createdTailoredResume.email,
        phone: createdTailoredResume.phone,
        location: createdTailoredResume.location,
        skills: createdTailoredResume.skills,
        experience: createdTailoredResume.experience,
        education: createdTailoredResume.education,
        projects: createdTailoredResume.projects,
        achievments: createdTailoredResume.achievments,
        certifications: createdTailoredResume.certifications,
        languages: createdTailoredResume.languages,
        intrests: createdTailoredResume.intrests,
        status: createdTailoredResume.status,
        created_on: createdTailoredResume.created_on,
        updated_on: createdTailoredResume.updated_on,
      });
    } catch (error) {
      console.error("Unexpected error in CreateTailoredResumeUseCase:", error);
      return errClass(new InternalServerError());
    }
  }
}
