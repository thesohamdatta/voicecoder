/**
 * LLM Provider configurations
 */

import { ProviderConfig } from '../types';

/**
 * All available LLM providers with their configurations
 */
export const PROVIDERS: ProviderConfig[] = [
    {
        id: 'anthropic',
        name: 'Anthropic Claude',
        models: [
            {
                id: 'claude-sonnet-4-5-20250929',
                name: 'Claude Sonnet 4.5',
                contextWindow: 200000
            },
            {
                id: 'claude-opus-4-5-20251101',
                name: 'Claude Opus 4.5',
                contextWindow: 200000
            }
        ],
        pricing: {
            inputPer1k: 0.003,
            outputPer1k: 0.015
        },
        freeTier: {
            tokensPerMonth: 250000
        }
    },
    {
        id: 'openai',
        name: 'OpenAI',
        models: [
            {
                id: 'gpt-4-turbo',
                name: 'GPT-4 Turbo',
                contextWindow: 128000
            },
            {
                id: 'gpt-4o',
                name: 'GPT-4o',
                contextWindow: 128000
            },
            {
                id: 'gpt-3.5-turbo',
                name: 'GPT-3.5 Turbo',
                contextWindow: 16000
            }
        ],
        pricing: {
            inputPer1k: 0.01,
            outputPer1k: 0.03
        }
    },
    {
        id: 'google',
        name: 'Google Gemini',
        models: [
            {
                id: 'gemini-1.5-pro',
                name: 'Gemini 1.5 Pro',
                contextWindow: 1000000
            },
            {
                id: 'gemini-1.5-flash',
                name: 'Gemini 1.5 Flash',
                contextWindow: 1000000
            }
        ],
        pricing: {
            inputPer1k: 0.00125,
            outputPer1k: 0.005
        },
        freeTier: {
            requestsPerMinute: 15
        }
    },
    {
        id: 'ollama',
        name: 'Ollama (Local)',
        baseUrl: 'http://localhost:11434',
        models: [
            {
                id: 'codellama',
                name: 'CodeLlama 7B',
                contextWindow: 16000
            },
            {
                id: 'deepseek-coder',
                name: 'DeepSeek Coder 6.7B',
                contextWindow: 16000
            },
            {
                id: 'qwen2.5-coder',
                name: 'Qwen2.5 Coder 7B',
                contextWindow: 32000
            }
        ],
        pricing: {
            inputPer1k: 0,
            outputPer1k: 0
        },
        freeTier: {
            tokensPerMonth: Infinity
        }
    }
];

/**
 * Get provider configuration by ID
 */
export function getProviderConfig(providerId: string): ProviderConfig | undefined {
    return PROVIDERS.find(p => p.id === providerId);
}

/**
 * Get all provider IDs
 */
export function getProviderIds(): string[] {
    return PROVIDERS.map(p => p.id);
}
