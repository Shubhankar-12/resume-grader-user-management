import { Request } from 'express';
import { GetAnalyticsRequest } from './request';

const VALID_GROUP_BY = ['day', 'week', 'month'] as const;
type GroupBy = (typeof VALID_GROUP_BY)[number];

export function parseGetAnalyticsRequest(req: Request): GetAnalyticsRequest {
  const query = req.query as Record<string, string | undefined>;

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const from: string = query.from ?? sevenDaysAgo.toISOString();
  const to: string = query.to ?? now.toISOString();

  const rawGroupBy = query.groupBy ?? 'day';
  const groupBy: GroupBy = VALID_GROUP_BY.includes(rawGroupBy as GroupBy)
    ? (rawGroupBy as GroupBy)
    : 'day';

  return { from, to, groupBy };
}
