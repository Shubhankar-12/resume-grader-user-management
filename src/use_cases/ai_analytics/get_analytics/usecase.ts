import { AICostLogQueries } from '../../../db/queries/AICostLogQueries';
import { AICache } from '../../../prompts/cache';
import { GetAnalyticsRequest } from './request';

export interface GetAnalyticsResult {
  analytics: Awaited<ReturnType<AICostLogQueries['getAnalytics']>>;
  cache: Awaited<ReturnType<AICache['getStats']>>;
}

export class GetAnalyticsUseCase {
  private aiCostLogQueries: AICostLogQueries;

  constructor(aiCostLogQueries?: AICostLogQueries) {
    this.aiCostLogQueries = aiCostLogQueries ?? new AICostLogQueries();
  }

  async execute(request: GetAnalyticsRequest): Promise<GetAnalyticsResult> {
    const from = new Date(request.from);
    const to = new Date(request.to);
    const groupBy = request.groupBy;

    const [analytics, cache] = await Promise.all([
      this.aiCostLogQueries.getAnalytics(from, to, groupBy),
      new AICache().getStats(),
    ]);

    return { analytics, cache };
  }
}
