import { GetAnalyticsRequest } from './request';

const VALID_GROUP_BY = ['day', 'week', 'month'] as const;

export function validateGetAnalyticsRequest(req: GetAnalyticsRequest): string | null {
  const { from, to, groupBy } = req;

  if (!from || isNaN(Date.parse(from))) {
    return '"from" must be a valid ISO date string';
  }

  if (!to || isNaN(Date.parse(to))) {
    return '"to" must be a valid ISO date string';
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (fromDate >= toDate) {
    return 'Invalid date range: "from" must be before "to"';
  }

  if (!VALID_GROUP_BY.includes(groupBy as (typeof VALID_GROUP_BY)[number])) {
    return 'groupBy must be one of: day, week, month';
  }

  return null;
}
