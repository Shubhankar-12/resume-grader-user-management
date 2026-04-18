import { WebhookEvent } from '../webhook_event/model';

export const webhookEventQueries = {
  async recordIfNew(provider: string, provider_event_id: string, event_type: string): Promise<boolean> {
    try {
      await WebhookEvent.create({ provider, provider_event_id, event_type });
      return true;
    } catch (e: any) {
      if (e.code === 11000) return false; // duplicate key = already processed
      throw e;
    }
  },
};
