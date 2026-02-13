/**
 * Anthropic Claude Provider Implementation
 */

import Anthropic from '@anthropic-ai/sdk';
import { Message, ChatOptions, ChatResponse, ProviderConfig } from '../../types';
import { LLMProvider } from './base';

/**
 * Anthropic Claude provider
 * Supports Claude Sonnet 4.5 and Claude Opus 4.5
 */
export class AnthropicProvider extends LLMProvider {
    private client: Anthropic;

    constructor(config: ProviderConfig) {
        super(config);

        if (!config.apiKey) {
            throw new Error('Anthropic API key is required');
        }

        this.client = new Anthropic({ apiKey: config.apiKey });
    }

    /**
     * Send a non-streaming chat request
     */
    async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
        try {
            // Separate system messages from chat messages
            const systemMessages = messages.filter(m => m.role === 'system');
            const chatMessages = messages.filter(m => m.role !== 'system');

            const response = await this.client.messages.create({
                model: options?.model || 'claude-sonnet-4-5-20250929',
                max_tokens: options?.maxTokens || 4000,
                temperature: options?.temperature || 0.7,
                system: systemMessages.map(m =>
                    typeof m.content === 'string' ? m.content : ''
                ).join('\n'),
                messages: chatMessages.map(m => ({
                    role: m.role as 'user' | 'assistant',
                    content: typeof m.content === 'string' ? m.content : ''
                }))
            });

            return {
                content: response.content[0].type === 'text' ? response.content[0].text : '',
                usage: {
                    inputTokens: response.usage.input_tokens,
                    outputTokens: response.usage.output_tokens
                },
                model: response.model
            };
        } catch (error) {
            throw new Error(`Anthropic API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            const systemMessages = messages.filter(m => m.role === 'system');
            const chatMessages = messages.filter(m => m.role !== 'system');

            const stream = await this.client.messages.create({
                model: options?.model || 'claude-sonnet-4-5-20250929',
                max_tokens: options?.maxTokens || 4000,
                temperature: options?.temperature || 0.7,
                system: systemMessages.map(m =>
                    typeof m.content === 'string' ? m.content : ''
                ).join('\n'),
                messages: chatMessages.map(m => ({
                    role: m.role as 'user' | 'assistant',
                    content: typeof m.content === 'string' ? m.content : ''
                })),
                stream: true
            });

            let fullContent = '';
            let usage = { inputTokens: 0, outputTokens: 0 };
            let modelName = 'claude-sonnet-4-5-20250929';

            for await (const event of stream) {
                if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                    const chunk = event.delta.text;
                    fullContent += chunk;
                    onChunk(chunk);
                } else if (event.type === 'message_delta') {
                    usage.outputTokens = event.usage.output_tokens;
                } else if (event.type === 'message_start') {
                    usage.inputTokens = event.message.usage.input_tokens;
                    modelName = event.message.model;
                }
            }

            return {
                content: fullContent,
                usage,
                model: modelName
            };
        } catch (error) {
            throw new Error(`Anthropic streaming error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
