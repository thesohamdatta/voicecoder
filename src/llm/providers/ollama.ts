/**
 * Ollama Provider Implementation (Local/Free)
 */

import { Message, ChatOptions, ChatResponse, ProviderConfig } from '../../types';
import { LLMProvider } from './base';

/**
 * Ollama provider for local LLM models
 * 100% free, runs locally, supports CodeLlama, DeepSeek Coder, Qwen2.5 Coder
 */
export class OllamaProvider extends LLMProvider {
    private baseUrl: string;

    constructor(config: ProviderConfig) {
        super(config);
        this.baseUrl = config.baseUrl || 'http://localhost:11434';
    }

    /**
     * Send a non-streaming chat request
     */
    async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: options?.model || 'codellama',
                    messages: messages.map(m => ({
                        role: m.role,
                        content: typeof m.content === 'string' ? m.content : ''
                    })),
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json() as { message?: { content?: string }; model?: string };

            if (!data.message?.content) {
                throw new Error('Invalid response from Ollama API');
            }

            return {
                content: data.message.content,
                usage: {
                    // Ollama doesn't provide detailed token usage
                    inputTokens: 0,
                    outputTokens: 0
                },
                model: data.model || 'codellama'
            };
        } catch (error) {
            if (error instanceof Error && error.message.includes('fetch')) {
                throw new Error('Ollama server not running. Please start Ollama with: ollama serve');
            }
            throw new Error(`Ollama API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: options?.model || 'codellama',
                    messages: messages.map(m => ({
                        role: m.role,
                        content: typeof m.content === 'string' ? m.content : ''
                    })),
                    stream: true
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API returned ${response.status}: ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Response body is not readable');
            }

            const decoder = new TextDecoder();
            let fullContent = '';
            let modelName = options?.model || 'codellama';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(l => l.trim());

                for (const line of lines) {
                    try {
                        const json = JSON.parse(line);
                        if (json.message?.content) {
                            fullContent += json.message.content;
                            onChunk(json.message.content);
                        }
                        if (json.model) {
                            modelName = json.model;
                        }
                    } catch (e) {
                        // Skip invalid JSON lines
                        continue;
                    }
                }
            }

            return {
                content: fullContent,
                usage: {
                    inputTokens: 0,
                    outputTokens: 0
                },
                model: modelName
            };
        } catch (error) {
            if (error instanceof Error && error.message.includes('fetch')) {
                throw new Error('Ollama server not running. Please start Ollama with: ollama serve');
            }
            throw new Error(`Ollama streaming error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
