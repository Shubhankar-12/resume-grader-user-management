import { IGetAllCoverLettersQueryParam } from "./request";

export interface IGetAllCoverLettersQueryDto {
  user_id: string;
  skip?: number;
  limit?: number;
  search?: string;
}

export class GetAllCoverLettersDtoConverter {
  private output_object: IGetAllCoverLettersQueryDto;
  constructor(data: IGetAllCoverLettersQueryParam) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    this.output_object = {
      user_id: data.user_id,
      skip: data.skip != undefined ? parseInt(data.skip) : undefined,
      limit: data.limit != undefined ? parseInt(data.limit) : undefined,
      search: data.search ? data.search : "",
    };
  }
  public getDtoObject(): IGetAllCoverLettersQueryDto {
    return this.output_object;
  }
}
