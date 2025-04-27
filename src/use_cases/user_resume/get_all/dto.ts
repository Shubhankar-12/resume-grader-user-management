import { IGetAllUserResumesQueryParam } from "./request";

export interface IGetAllUserResumesQueryDto {
  user_id: string;
  skip?: number;
  limit?: number;
  search?: string;
}

export class GetAllUserResumesDtoConverter {
  private output_object: IGetAllUserResumesQueryDto;
  constructor(data: IGetAllUserResumesQueryParam) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    this.output_object = {
      user_id: data.user_id,
      skip: data.skip != undefined ? parseInt(data.skip) : undefined,
      limit: data.limit != undefined ? parseInt(data.limit) : undefined,
      search: data.search ? data.search : "",
    };
  }
  public getDtoObject(): IGetAllUserResumesQueryDto {
    return this.output_object;
  }
}
