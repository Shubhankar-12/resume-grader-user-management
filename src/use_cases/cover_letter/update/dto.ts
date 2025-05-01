import { IUpdateCoverLetterRequest } from "./request";

export interface IUpdateCoverLetterDto {
  cover_letter_id: string;
  cover_letter?: string;
  cover_letter_summary?: string;
  status?: string;
}

export class UpdateCoverLetterDtoConverter {
  private output_object: IUpdateCoverLetterDto;
  constructor(data: IUpdateCoverLetterRequest) {
    this.output_object = {
      cover_letter_id: data.cover_letter_id,

      cover_letter: data.cover_letter ? data.cover_letter : undefined,
      cover_letter_summary: data.cover_letter_summary
        ? data.cover_letter_summary
        : undefined,
      status: data.status ? data.status : undefined,
    };
  }
  public getDtoObject(): IUpdateCoverLetterDto {
    return this.output_object;
  }
}
