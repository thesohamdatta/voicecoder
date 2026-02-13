


# VoiceCoder

AI-powered code assistance for Visual Studio Code with support for multiple
language models.

## Overview

VoiceCoder integrates leading AI providers into your development workflow,
enabling intelligent code analysis, explanation, and assistance directly within
VS Code.

## Important:
currently voicecoder is changing its foundational architecture and migrating  extension based assistance to  a integrated voice assisatnce in IDE . 
stay tuned

## Supported Providers

**Anthropic Claude**\
Models: Sonnet 4.5, Opus 4.5\
Context: 200K tokens

**OpenAI**\
Models: GPT-4 Turbo, GPT-4o, GPT-3.5 Turbo\
Context: 128K tokens

**Google Gemini**\
Models: Gemini 2.5 Flash, Gemini 2.5 Pro\
Context: 1M tokens

**Ollama**\
Models: CodeLlama, DeepSeek Coder, Qwen2.5 Coder\
Local execution, no API key required

## Installation

Install from the VS Code marketplace or build from source.

## Quick Start

1. Open Command Palette (Ctrl+Shift+P)
2. Run "VoiceCoder: Select AI Provider"
3. Enter API key when prompted
4. Select code and run "VoiceCoder: Ask About Selected Code"

## Commands

- `VoiceCoder: Select AI Provider` - Configure provider
- `VoiceCoder: Ask About Selected Code` - Analyze code
- `VoiceCoder: Show Usage & Costs` - View statistics

## API Keys

**Anthropic**: https://console.anthropic.com\
**OpenAI**: https://platform.openai.com\
**Google**: https://makersuite.google.com/app/apikey\
**Ollama**: https://ollama.ai (no key required)

All keys are stored securely using VS Code's secret storage.

## Development

```bash
npm install
npm run compile
npm run watch
```

Press F5 in VS Code to launch the extension development host.

## Architecture

```
src/
├── extension.ts          # Entry point
├── llm/                  # Provider implementations
├── security/             # Key management
├── types/                # TypeScript definitions
└── utils/                # Utilities
```

## License

MIT

## Contributing

Issues and pull requests welcome.
