---
trigger: always_on
---

# VoiceCoder Rules

## Code Philosophy
**SIMPLE > CLEVER**  
**STABLE > FEATURE-RICH**  
**FAST > PERFECT**

## Core Principles
1. **No Magic** - Explicit over implicit, always
2. **No Dependencies** - Use native APIs first, libraries last
3. **No Crashes** - Wrap everything in try-catch
4. **No Surprises** - Errors are friendly, predictable

## Architecture
- Max 5 core files
- One file = One responsibility
- Provider pattern for LLMs
- Factory pattern for creation
- Observer pattern for events

## Performance
- Activation: < 500ms
- First token: < 2s
- Memory: < 100MB
- File watcher: < 50ms

## Error Handling
```typescripttry {
await doThing();
} catch (error) {
logger.error('Context:', error);
throw new FriendlyError('User message', error);
}

## Provider Priority
1. **Ollama** → Free, local, fast
2. **Gemini** → Free tier, 15 RPM
3. **Claude** → $5 credit, best code
4. **OpenAI** → Paid only, use last

## Testing
- Every provider: Real API test
- Every feature: Error case test
- Every release: Performance benchmark

## Git Commits
- `feat:` New feature
- `fix:` Bug fix
- `perf:` Performance improvement
- `refactor:` Code cleanup
- `docs:` Documentation

## Never
❌ `any` types  
❌ `console.log` in production  
❌ Synchronous API calls  
❌ Plain text API keys  
❌ Features without tests  

## Always
✅ TypeScript types  
✅ Error boundaries  
✅ Async/await  
✅ Secrets API for keys  
✅ Tests pass before commit  

---

*When in doubt, choose simple.*