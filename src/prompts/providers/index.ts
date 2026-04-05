import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';
import { GeminiProvider } from './gemini';
import { detectProvider } from '../config';
import type { AIProvider } from '../types';

export { OpenAIProvider } from './openai';
export { AnthropicProvider } from './anthropic';
export { GeminiProvider } from './gemini';

const providerCache = new Map<string, AIProvider>();

export function getProvider(model: string): AIProvider {
  const providerName = detectProvider(model);

  if (providerCache.has(providerName)) {
    return providerCache.get(providerName)!;
  }

  let provider: AIProvider;

  switch (providerName) {
    case 'openai': {
      const key = process.env.OPENAI_API_KEY;
      if (!key) throw new Error('OPENAI_API_KEY is required for model: ' + model);
      provider = new OpenAIProvider(key);
      break;
    }
    case 'anthropic': {
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key) throw new Error('ANTHROPIC_API_KEY is required for model: ' + model);
      provider = new AnthropicProvider(key);
      break;
    }
    case 'gemini': {
      const key = process.env.GEMINI_API_KEY;
      if (!key) throw new Error('GEMINI_API_KEY is required for model: ' + model);
      provider = new GeminiProvider(key);
      break;
    }
  }

  providerCache.set(providerName, provider);
  return provider;
}
