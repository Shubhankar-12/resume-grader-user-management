import { Schema } from 'mongoose';

export const WebhookEventSchema = new Schema({
  provider: { type: String, required: true, enum: ['stripe', 'razorpay'] },
  provider_event_id: { type: String, required: true },
  event_type: { type: String, required: true },
  processed_on: { type: Date, default: Date.now },
}, {
  timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
});

WebhookEventSchema.index({ provider: 1, provider_event_id: 1 }, { unique: true } as any);
