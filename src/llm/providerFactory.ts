/**
 * Provider Factory
 * Creates and manages LLM provider instances
 */

import { LLMProvider } from './providers/base';
import { AnthropicProvider } from './providers/anthropic';
import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';
import { OllamaProvider } from './providers/ollama';
import { ProviderConfig } from '../types';
import { getProviderConfig } from './config';

/**
 * Factory for creating LLM provider instances
 * Implements singleton pattern for provider reuse
 */
export class ProviderFactory {
    private static providers = new Map<string, LLMProvider>();

    /**
     * Get or create a provider instance
     * @param providerId - The provider ID (anthropic, openai, google, ollama)
     * @param apiKey - Optional API key (required for cloud providers)
     * @returns LLMProvider instance
     */
    static getProvider(providerId: string, apiKey?: string): LLMProvider {
        const cacheKey = `${providerId}-${apiKey || 'default'}`;

        if (!this.providers.has(cacheKey)) {
            const config = getProviderConfig(providerId);
            if (!config) {
                throw new Error(`Unknown provider: ${providerId}`);
            }

            // Add API key to config if provided
            const configWithKey: ProviderConfig = {
                ...config,
                apiKey: apiKey || config.apiKey
            };

            const provider = this.createProvider(providerId, configWithKey);
            this.providers.set(cacheKey, provider);
        }

        return this.providers.get(cacheKey)!;
    }

    /**
     * Create a new provider instance
     */
    private static createProvider(providerId: string, config: ProviderConfig): LLMProvider {
        switch (providerId) {
            case 'anthropic':
                return new AnthropicProvider(config);
            case 'openai':
                return new OpenAIProvider(config);
            case 'google':
                return new GeminiProvider(config);
            case 'ollama':
                return new OllamaProvider(config);
            default:
                throw new Error(`Unknown provider: ${providerId}`);
        }
    }

    /**
     * Clear the provider cache
     * Useful for testing or when API keys change
     */
    static clearCache() {
        this.providers.clear();
    }

    /**
     * Remove a specific provider from cache
     */
    static removeProvider(providerId: string, apiKey?: string) {
        const cacheKey = `${providerId}-${apiKey || 'default'}`;
        this.providers.delete(cacheKey);
    }
}
