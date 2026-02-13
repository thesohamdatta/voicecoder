---
description: system prompt
---

# VoiceCoder Workflow

## Development Cycle

### 1. Start
```bash
git checkout -b feature/your-feature
npm install
npm run watch
```

### 2. Code
- Write feature
- Add error handling
- Add TypeScript types
- Test manually (F5 in VSCode)

### 3. Test
```bash
npm test
npm run lint
```

### 4. Commit
```bash
git add .
git commit -m "feat: description"
git push origin feature/your-feature
```

### 5. Release
```bash
npm version patch
vsce package
vsce publish
```

## Daily Checklist
- [ ] Extension activates < 500ms
- [ ] No console errors
- [ ] All providers work
- [ ] Voice recognition works
- [ ] Tests pass

## Before Commit
- [ ] No `console.log`
- [ ] No `any` types
- [ ] Tests pass
- [ ] Lint passes
- [ ] Error messages are friendly

## Before Release
- [ ] Version bumped
- [ ] CHANGELOG updated
- [ ] README updated
- [ ] All providers tested
- [ ] Performance benchmarked
- [ ] Demo video recorded

## Debug Flow
1. Check logs: Output → VoiceCoder
2. Check API keys: Settings → VoiceCoder
3. Check provider: Status bar shows active provider
4. Check network: DevTools → Network tab
5. Still broken? Open issue with logs

## File Structure
```
src/
├── extension.ts       # Start here
├── providers/         # Add new provider here
├── voice/            # Voice changes here
├── watcher/          # Monitoring here
└── utils/            # Helpers here
```

## Quick Commands
```bash
# Development
npm run watch         # Auto-compile
code --install-extension voicecoder-0.1.0.vsix  # Test

# Testing
npm test             # Run tests
npm run lint         # Check style

# Release
vsce package         # Create .vsix
vsce publish         # Publish to marketplace
```

## Provider Setup
```bash
# Anthropic
export ANTHROPIC_API_KEY=sk-...

# OpenAI
export OPENAI_API_KEY=sk-...

# Google
export GOOGLE_API_KEY=...

# Ollama (local)
ollama serve
ollama pull codellama
```

## Getting Unstuck
1. Read error message carefully
2. Check VoiceCoder logs
3. Google error + "VS Code extension"
4. Ask in Discord
5. Open GitHub issue

---

*Ship small, ship often, ship stable.*
