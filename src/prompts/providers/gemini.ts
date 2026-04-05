import { GoogleGenAI } from '@google/genai';
import type { AIProvider, AIProviderParams, AIResponse } from '../types';

export class GeminiProvider implements AIProvider {
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async complete(params: AIProviderParams): Promise<AIResponse> {
    const start = Date.now();

    const systemMessage = params.messages.find((m) => m.role === 'system');
    const userMessages = params.messages.filter((m) => m.role !== 'system');

    const contents = userMessages.map((m) => ({
      role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text: m.content }],
    }));

    const response = await this.client.models.generateContent({
      model: params.model,
      contents,
      config: {
        temperature: params.temperature,
        ...(params.maxTokens && { maxOutputTokens: params.maxTokens }),
        ...(systemMessage && { systemInstruction: systemMessage.content }),
        ...(params.jsonMode && { responseMimeType: 'application/json' }),
      },
    });

    const latencyMs = Date.now() - start;
    const content = response.text || '';

    return {
      content,
      usage: {
        inputTokens: response.usageMetadata?.promptTokenCount || 0,
        outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
      },
      model: params.model,
      provider: 'gemini',
      latencyMs,
    };
  }
}
