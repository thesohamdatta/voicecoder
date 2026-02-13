# VoiceCoder - Multi-Provider Voice Coding Assistant

Voice-controlled coding assistant for VS Code with support for Claude, GPT, Gemini, and free local models.

## 🚀 Features

- **Multi-Provider Support**: Choose from Anthropic Claude, OpenAI GPT, Google Gemini, or Ollama (local/free)
- **Voice Control**: Code using your voice (coming soon)
- **Smart Code Analysis**: Ask questions about selected code
- **Cost Tracking**: Monitor token usage and estimated costs
- **100% Free Option**: Use Ollama for unlimited local LLM access
- **Secure API Keys**: Keys stored securely in VS Code's secret storage

## 📦 Installation

1. Install from VS Code Marketplace (coming soon)
2. Or install from VSIX:
   ```bash
   code --install-extension voicecoder-0.1.0.vsix
   ```

## 🎯 Quick Start

1. **Select Your AI Provider**
   - Press `Cmd/Ctrl+Shift+P`
   - Type "VoiceCoder: Select AI Provider"
   - Choose your preferred provider
   - Enter API key when prompted (not needed for Ollama)

2. **Ask About Code**
   - Select code in your editor
   - Right-click → "VoiceCoder: Ask About Selected Code"
   - Or press `Cmd/Ctrl+Shift+P` → "VoiceCoder: Ask About Selected Code"
   - Type your question
   - Get instant AI-powered answers!

3. **Check Usage & Costs**
   - Press `Cmd/Ctrl+Shift+P`
   - Type "VoiceCoder: Show Usage & Costs"
   - View detailed token usage and cost breakdown

## 🤖 Supported Providers

### Anthropic Claude
- **Models**: Claude Sonnet 4.5, Claude Opus 4.5
- **Best for**: Code understanding and complex analysis
- **Pricing**: From $0.003/1K tokens
- **Free Tier**: $5 credit

### OpenAI GPT
- **Models**: GPT-4 Turbo, GPT-4o, GPT-3.5 Turbo
- **Best for**: General AI tasks
- **Pricing**: From $0.01/1K tokens

### Google Gemini
- **Models**: Gemini 1.5 Pro, Gemini 1.5 Flash
- **Best for**: Fast responses with large context
- **Pricing**: From $0.00125/1K tokens
- **Free Tier**: 15 requests per minute

### Ollama (Local)
- **Models**: CodeLlama, DeepSeek Coder, Qwen2.5 Coder
- **Best for**: Privacy, offline use, unlimited usage
- **Pricing**: 100% FREE
- **Setup**: Install [Ollama](https://ollama.ai) and run `ollama serve`

## ⚙️ Configuration

Open VS Code settings and search for "VoiceCoder":

- `voicecoder.provider`: Choose your AI provider
- `voicecoder.model`: Select specific model (or "auto")
- `voicecoder.voiceInput`: Voice input method (web/whisper)
- `voicecoder.proactiveAssistance`: Enable proactive suggestions
- `voicecoder.ollamaUrl`: Ollama server URL (default: http://localhost:11434)

## 🔒 Security

- API keys are stored securely using VS Code's built-in secret storage
- Keys are never logged or transmitted except to the respective AI providers
- Local models (Ollama) require no API keys

## 📊 Cost Management

VoiceCoder tracks all token usage and provides detailed cost estimates:

- Per-provider token counts
- Estimated costs in USD
- Total usage across all providers
- Reset tracking anytime

## 🛠️ Development

### Prerequisites
- Node.js 22.x
- VS Code 1.80+

### Setup
```bash
git clone <repository>
cd voicecoder
npm install
npm run compile
```

### Run Extension
1. Press `F5` in VS Code
2. A new Extension Development Host window will open
3. Test the extension

### Build VSIX
```bash
npm install -g @vscode/vsce
vsce package
```

## 📝 Roadmap

- [x] Multi-provider LLM support
- [x] Code analysis and Q&A
- [x] Cost tracking
- [ ] Voice input (Web Speech API)
- [ ] Voice input (Whisper)
- [ ] Proactive code monitoring
- [ ] File watching and suggestions
- [ ] Custom prompts
- [ ] Team collaboration features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Anthropic for Claude API
- OpenAI for GPT API
- Google for Gemini API
- Ollama for local LLM runtime

## 📞 Support

- GitHub Issues: [Report bugs or request features]
- Documentation: [Link to docs]

---

**Made with ❤️ for developers who want to code faster with AI**
