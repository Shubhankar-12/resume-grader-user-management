import { IGetCoverLetterQuery } from "./request";

export interface IGetCoverLetterDto {
  cover_letter_id: string;
}

export class GetCoverLetterDtoConverter {
  private output_object: IGetCoverLetterDto;
  constructor(query: IGetCoverLetterQuery) {
    this.output_object = {
      cover_letter_id: query.cover_letter_id,
    };
  }
  public getDtoObject(): IGetCoverLetterDto {
    return this.output_object;
  }
}
