/**
 * Core type definitions for VoiceCoder
 */

/**
 * Message format for LLM conversations
 */
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: 'text' | 'image'; text?: string; imageUrl?: string }>;
}

/**
 * Options for chat requests
 */
export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  model?: string;
}

/**
 * Response from LLM chat
 */
export interface ChatResponse {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  model: string;
}

/**
 * Model configuration
 */
export interface ModelConfig {
  id: string;
  name: string;
  contextWindow: number;
}

/**
 * Provider configuration
 */
export interface ProviderConfig {
  id: string;
  name: string;
  apiKey?: string;
  baseUrl?: string;
  models: ModelConfig[];
  pricing: {
    inputPer1k: number;  // USD per 1k tokens
    outputPer1k: number;
  };
  freeTier?: {
    tokensPerMonth?: number;
    requestsPerMinute?: number;
  };
}

/**
 * Code context for LLM requests
 */
export interface CodeContext {
  currentFile: string;
  language: string;
  selectedCode: string;
  surroundingCode: string;
  projectStructure: string[];
  recentChanges: Change[];
  openFiles: string[];
  dependencies: Record<string, string>;
}

/**
 * File change information
 */
export interface Change {
  file: string;
  type: 'added' | 'modified' | 'deleted';
  timestamp: number;
}

/**
 * File watching event
 */
export interface FileEvent {
  path: string;
  type: 'add' | 'change' | 'unlink';
  timestamp: number;
}

/**
 * Analysis rule for code monitoring
 */
export interface AnalysisRule {
  name: string;
  check: (code: string) => boolean;
  severity: 'info' | 'warning' | 'error';
  message: string;
}

/**
 * Analysis result
 */
export interface AnalysisResult {
  rule: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
}

/**
 * Usage tracking data
 */
export interface UsageData {
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
}

/**
 * Voice provider types
 */
export type VoiceProviderType = 'web' | 'whisper';

/**
 * LLM provider types
 */
export type LLMProviderType = 'anthropic' | 'openai' | 'google' | 'ollama';
