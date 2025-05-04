import { IGetDashboardStatsQuery } from "./request";

export interface IGetDashboardStatsDto {}

export class GetDashboardStatsDtoConverter {
  private output_object: IGetDashboardStatsDto;
  constructor(query: IGetDashboardStatsQuery) {
    this.output_object = {};
  }
  public getDtoObject(): IGetDashboardStatsDto {
    return this.output_object;
  }
}
