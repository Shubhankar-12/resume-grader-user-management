import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, AIProviderParams, AIResponse } from '../types';

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async complete(params: AIProviderParams): Promise<AIResponse> {
    const start = Date.now();

    // Anthropic uses system as a top-level param, not in messages
    const systemMessage = params.messages.find((m) => m.role === 'system');
    const nonSystemMessages = params.messages.filter((m) => m.role !== 'system');

    const response = await this.client.messages.create({
      model: params.model,
      max_tokens: params.maxTokens || 4096,
      temperature: params.temperature,
      ...(systemMessage && { system: systemMessage.content }),
      messages: nonSystemMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const latencyMs = Date.now() - start;
    const textBlock = response.content.find((block) => block.type === 'text');
    const content = textBlock && 'text' in textBlock ? textBlock.text : '';

    return {
      content,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
      model: params.model,
      provider: 'anthropic',
      latencyMs,
    };
  }
}
