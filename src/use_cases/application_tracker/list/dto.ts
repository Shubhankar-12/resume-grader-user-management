import { IListApplicationsQueryParam } from './request';

export interface IListApplicationsDto {
  user_id: string;
  search?: string;
  sort?: string;
}

export class ListApplicationsDtoConverter {
  private output_object: IListApplicationsDto;
  constructor(data: IListApplicationsQueryParam) {
    this.output_object = {
      user_id: data.user_id,
      search: data.search ? data.search : undefined,
      sort: data.sort ? data.sort : undefined,
    };
  }
  public getDtoObject(): IListApplicationsDto {
    return this.output_object;
  }
}
