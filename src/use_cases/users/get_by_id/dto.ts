import { IGetUserQuery } from "./request";

export interface IGetUserDto {
  user_id: string;
}

export class GetUserDtoConverter {
  private output_object: IGetUserDto;
  constructor(query: IGetUserQuery) {
    this.output_object = {
      user_id: query.user_id,
    };
  }
  public getDtoObject(): IGetUserDto {
    return this.output_object;
  }
}
