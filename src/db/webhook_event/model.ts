import { model } from 'mongoose';
import { WebhookEventSchema } from './schema';

export const WebhookEvent = model('WebhookEvent', WebhookEventSchema, 'webhook_events');
