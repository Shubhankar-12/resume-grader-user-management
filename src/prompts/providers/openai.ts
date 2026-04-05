import OpenAI from 'openai';
import type { AIProvider, AIProviderParams, AIResponse } from '../types';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async complete(params: AIProviderParams): Promise<AIResponse> {
    const start = Date.now();

    const response = await this.client.chat.completions.create({
      model: params.model,
      messages: params.messages,
      temperature: params.temperature,
      ...(params.maxTokens && { max_tokens: params.maxTokens }),
      ...(params.jsonMode && { response_format: { type: 'json_object' as const } }),
    });

    const latencyMs = Date.now() - start;
    const content = response.choices[0]?.message?.content || '';

    return {
      content,
      usage: {
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
      },
      model: params.model,
      provider: 'openai',
      latencyMs,
    };
  }
}
