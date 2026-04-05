import mongoose from 'mongoose';

const aiCostLogSchema = new mongoose.Schema(
  {
    functionName: { type: String, required: true, index: true },
    model: { type: String, required: true, index: true },
    provider: { type: String, required: true, index: true },
    inputTokens: { type: Number, required: true },
    outputTokens: { type: Number, required: true },
    estimatedCostUSD: { type: Number, required: true },
    latencyMs: { type: Number, required: true },
    cached: { type: Boolean, default: false },
    promptVersion: { type: String, required: true },
    userId: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
    collection: 'ai_cost_logs',
  }
);

aiCostLogSchema.index({ createdAt: 1 });
aiCostLogSchema.index({ functionName: 1, createdAt: 1 });

export { aiCostLogSchema };
