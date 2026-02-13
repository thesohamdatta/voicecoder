/**
 * Cost Tracker
 * Tracks token usage and estimated costs across all providers
 */

import * as vscode from 'vscode';
import { UsageData } from '../types';

/**
 * Tracks and persists usage data and costs for all LLM providers
 */
export class CostTracker {
    private usage: Record<string, UsageData> = {};
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.load();
    }

    /**
     * Track a request's token usage and cost
     * @param provider - Provider ID
     * @param inputTokens - Number of input tokens
     * @param outputTokens - Number of output tokens
     * @param cost - Estimated cost in USD
     */
    track(provider: string, inputTokens: number, outputTokens: number, cost: number): void {
        if (!this.usage[provider]) {
            this.usage[provider] = {
                inputTokens: 0,
                outputTokens: 0,
                estimatedCost: 0
            };
        }

        this.usage[provider].inputTokens += inputTokens;
        this.usage[provider].outputTokens += outputTokens;
        this.usage[provider].estimatedCost += cost;

        this.persist();
    }

    /**
     * Get usage data for a specific provider or all providers
     * @param provider - Optional provider ID
     * @returns Usage data
     */
    getUsage(provider?: string): UsageData | Record<string, UsageData> {
        if (provider) {
            return this.usage[provider] || {
                inputTokens: 0,
                outputTokens: 0,
                estimatedCost: 0
            };
        }
        return this.usage;
    }

    /**
     * Get total cost across all providers
     * @returns Total estimated cost in USD
     */
    getTotalCost(): number {
        return Object.values(this.usage).reduce(
            (sum, u) => sum + u.estimatedCost,
            0
        );
    }

    /**
     * Get total tokens across all providers
     * @returns Object with total input and output tokens
     */
    getTotalTokens(): { input: number; output: number } {
        return Object.values(this.usage).reduce(
            (totals, u) => ({
                input: totals.input + u.inputTokens,
                output: totals.output + u.outputTokens
            }),
            { input: 0, output: 0 }
        );
    }

    /**
     * Reset all usage data
     */
    reset(): void {
        this.usage = {};
        this.persist();
    }

    /**
     * Reset usage data for a specific provider
     * @param provider - Provider ID
     */
    resetProvider(provider: string): void {
        delete this.usage[provider];
        this.persist();
    }

    /**
     * Get a formatted summary of usage
     * @returns Formatted string with usage statistics
     */
    getSummary(): string {
        const lines: string[] = ['VoiceCoder Usage Summary', '='.repeat(40)];

        for (const [provider, data] of Object.entries(this.usage)) {
            lines.push('');
            lines.push(`Provider: ${provider}`);
            lines.push(`  Input tokens: ${data.inputTokens.toLocaleString()}`);
            lines.push(`  Output tokens: ${data.outputTokens.toLocaleString()}`);
            lines.push(`  Estimated cost: $${data.estimatedCost.toFixed(4)}`);
        }

        const totals = this.getTotalTokens();
        const totalCost = this.getTotalCost();

        lines.push('');
        lines.push('='.repeat(40));
        lines.push(`Total input tokens: ${totals.input.toLocaleString()}`);
        lines.push(`Total output tokens: ${totals.output.toLocaleString()}`);
        lines.push(`Total estimated cost: $${totalCost.toFixed(4)}`);

        return lines.join('\n');
    }

    /**
     * Load usage data from persistent storage
     */
    private load(): void {
        const stored = this.context.globalState.get<Record<string, UsageData>>('voicecoder.usage');
        if (stored) {
            this.usage = stored;
        }
    }

    /**
     * Persist usage data to storage
     */
    private persist(): void {
        this.context.globalState.update('voicecoder.usage', this.usage);
    }
}
