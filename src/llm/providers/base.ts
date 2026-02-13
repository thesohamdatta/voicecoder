/**
 * Base LLM Provider abstract class
 * All provider implementations must extend this class
 */

import { Message, ChatOptions, ChatResponse, ProviderConfig } from '../../types';

/**
 * Abstract base class for all LLM providers
 */
export abstract class LLMProvider {
    constructor(protected config: ProviderConfig) { }

    /**
     * Send a chat request to the LLM
     */
    abstract chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse>;

    /**
     * Send a streaming chat request to the LLM
     */
    abstract streamChat(
        messages: Message[],
        onChunk: (chunk: string) => void,
        options?: ChatOptions
    ): Promise<ChatResponse>;

    /**
     * Estimate the cost of a request based on token usage
     */
    estimateCost(inputTokens: number, outputTokens: number): number {
        return (
            (inputTokens / 1000) * this.config.pricing.inputPer1k +
            (outputTokens / 1000) * this.config.pricing.outputPer1k
        );
    }

    /**
     * Get the provider's name
     */
    getName(): string {
        return this.config.name;
    }

    /**
     * Get the provider's ID
     */
    getId(): string {
        return this.config.id;
    }

    /**
     * Get available models for this provider
     */
    getModels() {
        return this.config.models;
    }

    /**
     * Check if the provider has a free tier
     */
    hasFreeTier(): boolean {
        return !!this.config.freeTier;
    }
}
