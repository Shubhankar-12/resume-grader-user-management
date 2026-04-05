import OpenAI from 'openai';
import type { AIProvider, AIProviderParams, AIResponse, AIStreamEvent } from '../types';

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

  async *completeStream(params: AIProviderParams): AsyncGenerator<AIStreamEvent> {
    let fullContent = '';

    try {
      const stream = await this.client.chat.completions.create({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature,
        stream: true,
        stream_options: { include_usage: true },
        ...(params.maxTokens && { max_tokens: params.maxTokens }),
        ...(params.jsonMode && { response_format: { type: 'json_object' as const } }),
      });

      let usage = { inputTokens: 0, outputTokens: 0 };

      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          fullContent += delta;
          yield { type: 'token' as const, content: delta };
        }

        if (chunk.usage) {
          usage = {
            inputTokens: chunk.usage.prompt_tokens || 0,
            outputTokens: chunk.usage.completion_tokens || 0,
          };
        }
      }

      yield { type: 'done' as const, content: fullContent, usage };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Stream failed';
      yield { type: 'error' as const, content: message };
    }
  }
}
