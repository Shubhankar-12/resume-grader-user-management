import { IGetAllTailoredResumesQueryParam } from "./request";

export interface IGetAllTailoredResumesQueryDto {
  user_id: string;
  skip?: number;
  limit?: number;
  search?: string;
}

export class GetAllTailoredResumesDtoConverter {
  private output_object: IGetAllTailoredResumesQueryDto;
  constructor(data: IGetAllTailoredResumesQueryParam) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    this.output_object = {
      user_id: data.user_id,
      skip: data.skip != undefined ? parseInt(data.skip) : undefined,
      limit: data.limit != undefined ? parseInt(data.limit) : undefined,
      search: data.search ? data.search : "",
    };
  }
  public getDtoObject(): IGetAllTailoredResumesQueryDto {
    return this.output_object;
  }
}
