/**
 * API Key Manager
 * Securely stores and retrieves API keys using VS Code's secret storage
 */

import * as vscode from 'vscode';

/**
 * Manages API keys securely using VS Code's built-in secret storage
 */
export class KeyManager {
    private static readonly SECRET_STORAGE_KEY = 'voicecoder.apiKeys';

    /**
     * Store an API key securely
     * @param provider - Provider ID (anthropic, openai, google)
     * @param apiKey - The API key to store
     * @param context - VS Code extension context
     */
    static async setApiKey(
        provider: string,
        apiKey: string,
        context: vscode.ExtensionContext
    ): Promise<void> {
        const secrets = context.secrets;
        await secrets.store(`${this.SECRET_STORAGE_KEY}.${provider}`, apiKey);
    }

    /**
     * Retrieve an API key
     * @param provider - Provider ID
     * @param context - VS Code extension context
     * @returns The API key or undefined if not set
     */
    static async getApiKey(
        provider: string,
        context: vscode.ExtensionContext
    ): Promise<string | undefined> {
        const secrets = context.secrets;
        return await secrets.get(`${this.SECRET_STORAGE_KEY}.${provider}`);
    }

    /**
     * Delete an API key
     * @param provider - Provider ID
     * @param context - VS Code extension context
     */
    static async deleteApiKey(
        provider: string,
        context: vscode.ExtensionContext
    ): Promise<void> {
        const secrets = context.secrets;
        await secrets.delete(`${this.SECRET_STORAGE_KEY}.${provider}`);
    }

    /**
     * Check if an API key exists for a provider
     * @param provider - Provider ID
     * @param context - VS Code extension context
     * @returns True if API key exists
     */
    static async hasApiKey(
        provider: string,
        context: vscode.ExtensionContext
    ): Promise<boolean> {
        const apiKey = await this.getApiKey(provider, context);
        return !!apiKey;
    }

    /**
     * Prompt user to enter API key
     * @param provider - Provider name (for display)
     * @param context - VS Code extension context
     * @returns The entered API key or undefined if cancelled
     */
    static async promptForApiKey(
        provider: string,
        context: vscode.ExtensionContext
    ): Promise<string | undefined> {
        const apiKey = await vscode.window.showInputBox({
            prompt: `Enter your ${provider} API key`,
            password: true,
            placeHolder: 'sk-...',
            ignoreFocusOut: true
        });

        if (apiKey) {
            await this.setApiKey(provider, apiKey, context);
        }

        return apiKey;
    }
}
