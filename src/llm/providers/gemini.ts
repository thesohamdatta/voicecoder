/**
 * Google Gemini Provider Implementation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, ChatOptions, ChatResponse, ProviderConfig } from '../../types';
import { LLMProvider } from './base';

/**
 * Google Gemini provider
 * Supports Gemini 1.5 Pro and Gemini 1.5 Flash
 */
export class GeminiProvider extends LLMProvider {
    private client: GoogleGenerativeAI;

    constructor(config: ProviderConfig) {
        super(config);

        if (!config.apiKey) {
            throw new Error('Google API key is required');
        }

        this.client = new GoogleGenerativeAI(config.apiKey);
    }

    /**
     * Send a non-streaming chat request
     */
    async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
        try {
            const model = this.client.getGenerativeModel({
                model: options?.model || 'gemini-2.5-flash-latest'
            });

            // Convert messages to Gemini format
            // Gemini uses 'model' instead of 'assistant' and doesn't have 'system' role
            const history = messages.slice(0, -1).map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: typeof m.content === 'string' ? m.content : '' }]
            }));

            const lastMessage = messages[messages.length - 1];
            const lastContent = typeof lastMessage.content === 'string'
                ? lastMessage.content
                : '';

            const chat = model.startChat({ history });
            const result = await chat.sendMessage(lastContent);

            return {
                content: result.response.text(),
                usage: {
                    // Gemini doesn't provide detailed token counts in the response
                    inputTokens: 0,
                    outputTokens: 0
                },
                model: options?.model || 'gemini-2.5-flash-latest'
            };
        } catch (error) {
            throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            const model = this.client.getGenerativeModel({
                model: options?.model || 'gemini-2.5-flash-latest'
            });

            const history = messages.slice(0, -1).map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: typeof m.content === 'string' ? m.content : '' }]
            }));

            const lastMessage = messages[messages.length - 1];
            const lastContent = typeof lastMessage.content === 'string'
                ? lastMessage.content
                : '';

            const chat = model.startChat({ history });
            const result = await chat.sendMessageStream(lastContent);

            let fullContent = '';

            for await (const chunk of result.stream) {
                const text = chunk.text();
                fullContent += text;
                onChunk(text);
            }

            return {
                content: fullContent,
                usage: {
                    inputTokens: 0,
                    outputTokens: 0
                },
                model: options?.model || 'gemini-2.5-flash-latest'
            };
        } catch (error) {
            throw new Error(`Gemini streaming error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
