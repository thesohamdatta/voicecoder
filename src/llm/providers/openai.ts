/**
 * OpenAI GPT Provider Implementation
 */

import OpenAI from 'openai';
import { Message, ChatOptions, ChatResponse, ProviderConfig } from '../../types';
import { LLMProvider } from './base';

/**
 * OpenAI GPT provider
 * Supports GPT-4 Turbo, GPT-4o, and GPT-3.5 Turbo
 */
export class OpenAIProvider extends LLMProvider {
    private client: OpenAI;

    constructor(config: ProviderConfig) {
        super(config);

        if (!config.apiKey) {
            throw new Error('OpenAI API key is required');
        }

        this.client = new OpenAI({ apiKey: config.apiKey });
    }

    /**
     * Send a non-streaming chat request
     */
    async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
        try {
            const response = await this.client.chat.completions.create({
                model: options?.model || 'gpt-4-turbo',
                messages: messages.map(m => ({
                    role: m.role,
                    content: typeof m.content === 'string' ? m.content : ''
                })),
                temperature: options?.temperature || 0.7,
                max_tokens: options?.maxTokens || 4000
            });

            return {
                content: response.choices[0].message.content || '',
                usage: {
                    inputTokens: response.usage?.prompt_tokens || 0,
                    outputTokens: response.usage?.completion_tokens || 0
                },
                model: response.model
            };
        } catch (error) {
            throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Send a streaming chat request
     */
    async streamChat(
        messages: Message[],
        onChunk: (chunk: string) => void,
        options?: ChatOptions
    ): Promise<ChatResponse> {
        try {
            const stream = await this.client.chat.completions.create({
                model: options?.model || 'gpt-4-turbo',
                messages: messages.map(m => ({
                    role: m.role,
                    content: typeof m.content === 'string' ? m.content : ''
                })),
                temperature: options?.temperature || 0.7,
                max_tokens: options?.maxTokens || 4000,
                stream: true
            });

            let fullContent = '';
            let modelName = options?.model || 'gpt-4-turbo';

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    fullContent += content;
                    onChunk(content);
                }
                // Update model name if provided
                if (chunk.model) {
                    modelName = chunk.model;
                }
            }

            // Note: OpenAI doesn't provide token usage in streaming mode
            // We'll need to estimate or track separately
            return {
                content: fullContent,
                usage: {
                    inputTokens: 0,
                    outputTokens: 0
                },
                model: modelName
            };
        } catch (error) {
            throw new Error(`OpenAI streaming error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
