/**
 * VoiceCoder Extension Entry Point
 * Multi-provider voice coding assistant for VS Code
 */

import * as vscode from 'vscode';
import { ProviderFactory } from './llm/providerFactory';
import { KeyManager } from './security/keyManager';
import { CostTracker } from './utils/costTracker';
import { Message } from './types';

let costTracker: CostTracker;

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('VoiceCoder is now active!');

	// Initialize cost tracker
	costTracker = new CostTracker(context);

	// Register commands
	registerCommands(context);

	// Show welcome message
	vscode.window.showInformationMessage(
		'VoiceCoder activated! Use Cmd/Ctrl+Shift+P and search for "VoiceCoder" to get started.'
	);
}

/**
 * Register all extension commands
 */
function registerCommands(context: vscode.ExtensionContext) {
	// Toggle Voice Interface
	context.subscriptions.push(
		vscode.commands.registerCommand('voicecoder.toggleVoice', () => {
			vscode.window.showInformationMessage('Voice interface coming soon!');
		})
	);

	// Select AI Provider
	context.subscriptions.push(
		vscode.commands.registerCommand('voicecoder.selectProvider', async () => {
			const providers = [
				{
					label: '$(brain) Anthropic Claude',
					description: 'Claude Sonnet 4.5 - Best for code understanding',
					detail: 'From $0.003/1K tokens • $5 free credit',
					id: 'anthropic'
				},
				{
					label: '$(robot) OpenAI GPT',
					description: 'GPT-4 Turbo - Powerful general AI',
					detail: 'From $0.01/1K tokens',
					id: 'openai'
				},
				{
					label: '$(sparkle) Google Gemini',
					description: 'Gemini 1.5 Flash - Fast and free',
					detail: 'From $0.00125/1K tokens • 15 RPM free',
					id: 'google'
				},
				{
					label: '$(server) Ollama (Local)',
					description: 'CodeLlama, DeepSeek - 100% FREE',
					detail: 'Runs locally • Unlimited usage',
					id: 'ollama'
				}
			];

			const selected = await vscode.window.showQuickPick(providers, {
				placeHolder: 'Select your AI provider',
				title: 'VoiceCoder: Choose AI Provider'
			});

			if (selected) {
				// Update configuration
				await vscode.workspace.getConfiguration('voicecoder').update(
					'provider',
					selected.id,
					vscode.ConfigurationTarget.Global
				);

				// Prompt for API key if needed (not for Ollama)
				if (selected.id !== 'ollama') {
					const hasKey = await KeyManager.hasApiKey(selected.id, context);
					if (!hasKey) {
						await KeyManager.promptForApiKey(selected.id, context);
					}
				}

				vscode.window.showInformationMessage(
					`VoiceCoder provider set to: ${selected.label}`
				);
			}
		})
	);

	// Ask About Selected Code
	context.subscriptions.push(
		vscode.commands.registerCommand('voicecoder.askAboutCode', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('No active editor');
				return;
			}

			const selection = editor.document.getText(editor.selection);
			if (!selection) {
				vscode.window.showErrorMessage('No code selected');
				return;
			}

			// Get user's question
			const question = await vscode.window.showInputBox({
				prompt: 'What would you like to know about this code?',
				placeHolder: 'e.g., Explain what this does, Find bugs, Suggest improvements'
			});

			if (!question) {
				return;
			}

			// Get current provider
			const config = vscode.workspace.getConfiguration('voicecoder');
			const providerId = config.get<string>('provider') || 'anthropic';

			try {
				// Get API key
				let apiKey: string | undefined;
				if (providerId !== 'ollama') {
					apiKey = await KeyManager.getApiKey(providerId, context);
					if (!apiKey) {
						apiKey = await KeyManager.promptForApiKey(providerId, context);
						if (!apiKey) {
							return;
						}
					}
				}

				// Get provider instance
				const provider = ProviderFactory.getProvider(providerId, apiKey);

				// Show progress
				await vscode.window.withProgress(
					{
						location: vscode.ProgressLocation.Notification,
						title: 'VoiceCoder',
						cancellable: false
					},
					async (progress) => {
						progress.report({ message: 'Analyzing code...' });

						// Prepare messages
						const messages: Message[] = [
							{
								role: 'system',
								content: 'You are an expert coding assistant. Provide clear, concise, and helpful answers about code.'
							},
							{
								role: 'user',
								content: `Here is the code:\n\n\`\`\`${editor.document.languageId}\n${selection}\n\`\`\`\n\n${question}`
							}
						];

						// Get response
						const response = await provider.chat(messages);

						// Track usage
						const cost = provider.estimateCost(
							response.usage.inputTokens,
							response.usage.outputTokens
						);
						costTracker.track(
							providerId,
							response.usage.inputTokens,
							response.usage.outputTokens,
							cost
						);

						// Show response in new document
						const doc = await vscode.workspace.openTextDocument({
							content: `# VoiceCoder Response\n\n**Question:** ${question}\n\n**Answer:**\n\n${response.content}\n\n---\n*Provider: ${provider.getName()} | Model: ${response.model} | Cost: $${cost.toFixed(4)}*`,
							language: 'markdown'
						});

						await vscode.window.showTextDocument(doc);
					}
				);
			} catch (error) {
				vscode.window.showErrorMessage(
					`VoiceCoder error: ${error instanceof Error ? error.message : 'Unknown error'}`
				);
			}
		})
	);

	// Show Usage & Costs
	context.subscriptions.push(
		vscode.commands.registerCommand('voicecoder.showUsage', () => {
			const summary = costTracker.getSummary();

			// Create and show document
			vscode.workspace.openTextDocument({
				content: summary,
				language: 'plaintext'
			}).then(doc => {
				vscode.window.showTextDocument(doc);
			});
		})
	);
}

/**
 * Extension deactivation
 */
export function deactivate() {
	console.log('VoiceCoder deactivated');
}
