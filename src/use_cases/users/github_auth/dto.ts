import { IGithubUpdateRequest } from "./request";

export interface IGithubUpdateDto {
  code: string;
  state?: string;
}

export class GithubUpdateDtoConverter {
  private output_object: IGithubUpdateDto;
  constructor(data: IGithubUpdateRequest) {
    this.output_object = {
      code: data.code,
      state: data.state ? data.state : undefined,
    };
  }
  public getDtoObject(): IGithubUpdateDto {
    return this.output_object;
  }
}
