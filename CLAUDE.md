# Claude-Specific Repository Usage Guide

## 🤖 How Claude Should Use This Repository

### Repository Context
This is a **Horizon Worlds TypeScript development repository** containing 750+ organized files across 8 categories. Use this as a comprehensive reference for Meta's Horizon Worlds platform development.

### Search Strategy
1. **Start with INDEX.md** - Contains complete file inventory with descriptions
2. **Use directory structure** - Numbered categories (1-8) indicate functionality
3. **Follow naming patterns** - Files use consistent prefixes (`Base*.ts`, `UI_*.ts`, `Trigger_*.ts`)
4. **Check documentation first** - `6-DOCUMENTATION/` has guides before diving into code

### Code Reference Patterns
When helping with Horizon Worlds development:

```markdown
# Good: Specific file references
The player health system is implemented in `3-GAME-MECHANICS/player-systems/HealthManager.ts:45`

# Good: Pattern-based searches  
For UI components, check files matching `2-UI-SYSTEM/ui-examples/UI_*.ts`

# Good: Category guidance
For NPC behavior, explore `4-NPC-AI/npc-components/` directory
```

### Common User Requests & Responses

#### "How do I create a [component type]?"
1. Find relevant sample in `1-CORE-FRAMEWORK/samples/`
2. Reference similar components in appropriate category
3. Check `6-DOCUMENTATION/api-guides/` for API usage
4. Provide specific file paths and line numbers

#### "I'm getting [error]"
1. Search `6-DOCUMENTATION/error-logs/.Error_LOG.md/ERROR_LOG_INDEX.md`
2. Reference specific error category files
3. Suggest prevention patterns from documentation

#### "Show me examples of [feature]"
1. Check `7-EXAMPLE-PROJECTS/complete-games/` for full implementations
2. Find specific components in numbered directories
3. Reference multiple related files for complete context

### File Reading Strategy
```typescript
// Always read these files for context:
// 1. INDEX.md - File inventory
// 2. README.md - Organization details  
// 3. Specific component files
// 4. Related documentation in 6-DOCUMENTATION/

// Use Glob patterns for exploration:
// "**/*Player*.ts" - All player-related files
// "2-UI-SYSTEM/**/*.ts" - All UI files
// "samples/*.ts" - All sample implementations
```

### Code Assistance Guidelines

#### DO:
- Reference existing patterns from repository
- Provide file paths with line numbers: `file.ts:123`
- Use repository's naming conventions
- Check for similar implementations first
- Reference documentation and error logs

#### DON'T:
- Create new patterns that don't match repository style
- Ignore existing similar implementations
- Skip checking documentation directory
- Assume APIs without verifying against repository examples

### Horizon Worlds Specifics
This repository is for **Meta Horizon Worlds** platform:
- VR/AR social experiences
- Multiplayer environments  
- Custom TypeScript components
- Cross-platform (mobile, web, VR)

Always consider Horizon Worlds context when providing code assistance.

### Error Handling Reference
Use systematic approach from `6-DOCUMENTATION/error-logs/`:
1. **ERROR_LOG_INDEX.md** - Master error reference
2. **ERROR_LOGGING_METHODOLOGY.md** - Documentation standards
3. **Specific error files** - Binding, Component, Event, Type errors
4. **Prevention patterns** - Reusable solutions

### Quick File Patterns
```bash
# Base classes and samples
1-CORE-FRAMEWORK/base-components/Base*.ts
1-CORE-FRAMEWORK/samples/a_Sample_*.ts

# UI components
2-UI-SYSTEM/ui-examples/UI_*.ts
2-UI-SYSTEM/custom-ui-components/CUI_*.ts

# Game mechanics  
3-GAME-MECHANICS/triggers-events/Trigger_*.ts
3-GAME-MECHANICS/player-systems/Player*.ts

# NPCs and AI
4-NPC-AI/npc-components/NPC*.ts

# Utilities
5-UTILITIES/helper-functions/Util*.ts
```

### Success Metrics
Claude should provide:
- **Specific file references** with paths and line numbers
- **Pattern matching** based on repository conventions
- **Context awareness** of Horizon Worlds platform
- **Documentation integration** using error logs and guides
- **Code consistency** following existing patterns

### Repository Navigation Commands
When working with this repo, prioritize:
1. `Read INDEX.md` - Always start here
2. `Glob "pattern/**/*.ts"` - Find files by category
3. `Grep "specific_term"` - Search across codebase
4. `Read 6-DOCUMENTATION/...` - Check docs before coding
5. Reference existing implementations before creating new ones