export interface GetAnalyticsRequest {
  from: string;
  to: string;
  groupBy: 'day' | 'week' | 'month';
}
