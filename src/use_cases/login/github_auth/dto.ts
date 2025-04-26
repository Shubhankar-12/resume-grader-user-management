import { IGithubAuthRequest } from "./request";

export interface IGithubAuthDto {
  code: string;
  state?: string;
}

export class GithubAuthDtoConverter {
  private output_object: IGithubAuthDto;
  constructor(data: IGithubAuthRequest) {
    this.output_object = {
      code: data.code,
      state: data.state ? data.state : undefined,
    };
  }
  public getDtoObject(): IGithubAuthDto {
    return this.output_object;
  }
}
