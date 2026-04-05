import { AICostLog } from '../ai_cost_log';

interface AICostLogData {
  functionName: string;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUSD: number;
  latencyMs: number;
  cached: boolean;
  promptVersion: string;
  userId?: string | null;
}

interface AnalyticsTotals {
  totalCostUSD: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalRequests: number;
  avgLatencyMs: number;
}

interface AnalyticsBreakdown {
  [key: string]: {
    totalCostUSD: number;
    totalRequests: number;
    totalInputTokens: number;
    totalOutputTokens: number;
  };
}

interface AnalyticsTimelineEntry {
  date: string;
  totalCostUSD: number;
  totalRequests: number;
}

interface AnalyticsResult {
  totals: AnalyticsTotals;
  byModel: AnalyticsBreakdown;
  byTask: AnalyticsBreakdown;
  byProvider: AnalyticsBreakdown;
  timeline: AnalyticsTimelineEntry[];
}

export class AICostLogQueries {
  async create(data: AICostLogData): Promise<void> {
    await AICostLog.create(data);
  }

  async getAnalytics(
    from: Date,
    to: Date,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<AnalyticsResult> {
    const dateFormatMap: Record<string, string> = {
      day: '%Y-%m-%d',
      week: '%Y-W%V',
      month: '%Y-%m',
    };
    const dateFormat = dateFormatMap[groupBy];
    const matchStage = { $match: { createdAt: { $gte: from, $lte: to } } };

    const [totalsRaw, byModelRaw, byTaskRaw, byProviderRaw, timelineRaw] =
      await Promise.all([
        // Totals aggregation
        AICostLog.aggregate([
          matchStage,
          {
            $group: {
              _id: null,
              totalCostUSD: { $sum: '$estimatedCostUSD' },
              totalInputTokens: { $sum: '$inputTokens' },
              totalOutputTokens: { $sum: '$outputTokens' },
              totalRequests: { $sum: 1 },
              avgLatencyMs: { $avg: '$latencyMs' },
            },
          },
        ]),

        // By model aggregation
        AICostLog.aggregate([
          matchStage,
          {
            $group: {
              _id: '$model',
              totalCostUSD: { $sum: '$estimatedCostUSD' },
              totalRequests: { $sum: 1 },
              totalInputTokens: { $sum: '$inputTokens' },
              totalOutputTokens: { $sum: '$outputTokens' },
            },
          },
        ]),

        // By task (functionName) aggregation
        AICostLog.aggregate([
          matchStage,
          {
            $group: {
              _id: '$functionName',
              totalCostUSD: { $sum: '$estimatedCostUSD' },
              totalRequests: { $sum: 1 },
              totalInputTokens: { $sum: '$inputTokens' },
              totalOutputTokens: { $sum: '$outputTokens' },
            },
          },
        ]),

        // By provider aggregation
        AICostLog.aggregate([
          matchStage,
          {
            $group: {
              _id: '$provider',
              totalCostUSD: { $sum: '$estimatedCostUSD' },
              totalRequests: { $sum: 1 },
              totalInputTokens: { $sum: '$inputTokens' },
              totalOutputTokens: { $sum: '$outputTokens' },
            },
          },
        ]),

        // Timeline aggregation
        AICostLog.aggregate([
          matchStage,
          {
            $group: {
              _id: {
                $dateToString: { format: dateFormat, date: '$createdAt' },
              },
              totalCostUSD: { $sum: '$estimatedCostUSD' },
              totalRequests: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    const totals: AnalyticsTotals =
      totalsRaw.length > 0
        ? {
            totalCostUSD: totalsRaw[0].totalCostUSD,
            totalInputTokens: totalsRaw[0].totalInputTokens,
            totalOutputTokens: totalsRaw[0].totalOutputTokens,
            totalRequests: totalsRaw[0].totalRequests,
            avgLatencyMs: totalsRaw[0].avgLatencyMs,
          }
        : {
            totalCostUSD: 0,
            totalInputTokens: 0,
            totalOutputTokens: 0,
            totalRequests: 0,
            avgLatencyMs: 0,
          };

    const toBreakdown = (raw: Array<{ _id: string; totalCostUSD: number; totalRequests: number; totalInputTokens: number; totalOutputTokens: number }>): AnalyticsBreakdown =>
      raw.reduce<AnalyticsBreakdown>((acc, entry) => {
        acc[entry._id] = {
          totalCostUSD: entry.totalCostUSD,
          totalRequests: entry.totalRequests,
          totalInputTokens: entry.totalInputTokens,
          totalOutputTokens: entry.totalOutputTokens,
        };
        return acc;
      }, {});

    const timeline: AnalyticsTimelineEntry[] = timelineRaw.map((entry) => ({
      date: entry._id,
      totalCostUSD: entry.totalCostUSD,
      totalRequests: entry.totalRequests,
    }));

    return {
      totals,
      byModel: toBreakdown(byModelRaw),
      byTask: toBreakdown(byTaskRaw),
      byProvider: toBreakdown(byProviderRaw),
      timeline,
    };
  }
}

export const aiCostLogQueries = new AICostLogQueries();
