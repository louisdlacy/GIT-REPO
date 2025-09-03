# Horizon Worlds TypeScript Component Library

**ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Repository Overview
This is a **Horizon Worlds TypeScript component library** containing 1,419 TypeScript files organized into 8 functional categories. This is NOT a traditional web application - files are meant to be used individually in the Horizon Worlds editor, not built as a monolithic project.

### Environment Setup - NO BUILD REQUIRED
- **DO NOT attempt to build this repository** - It contains Horizon Worlds components that require the Horizon Worlds runtime environment
- **DO NOT run `npm run build` or `tsc --build`** - This will fail with 2,500+ expected errors due to missing `horizon/core` modules
- The repository uses minimal dependencies: only `typescript@4.7.4` as a dev dependency
- TypeScript compilation happens in the Horizon Worlds editor, not in this repository

### Essential Commands That Work
- **File exploration**: `find . -name "*.ts" | head -20` - Lists TypeScript components (completes in 2 seconds)
- **Documentation search**: `grep -r "pattern" 6-DOCUMENTATION/` - Search extensive documentation (7,496 lines total)
- **Component search**: `find . -name "*ComponentName*" -type f` - Find specific components by name
- **Pattern analysis**: `grep -l "import.*horizon" --include="*.ts" . -r | wc -l` - Shows 825 files use Horizon APIs

### Essential Timeouts and Expectations
- **NEVER CANCEL**: File searches complete in 1-2 seconds
- **NEVER CANCEL**: Documentation searches complete in <1 second  
- **DO NOT SET LONG TIMEOUTS**: Most operations complete quickly
- **Repository exploration**: <5 seconds for full directory traversal

## Validation

### What You CAN Validate
- **File organization and structure** - Verify components are in correct directories
- **Documentation accuracy** - Check if documentation matches component implementations
- **Import patterns** - Analyze how components reference each other
- **Code style consistency** - Check naming conventions and patterns
- **Component completeness** - Verify all necessary files are present

### What You CANNOT Validate
- **TypeScript compilation** - Files use `horizon/core` modules not available outside Horizon Worlds
- **Runtime behavior** - Components require Horizon Worlds virtual environment
- **Unit testing** - No test framework exists and cannot be added due to runtime dependencies
- **Build processes** - No build system exists or is needed

### Manual Validation Requirements
After making changes to components:
1. **Check file placement** - Ensure components are in appropriate numbered directories (1-8)
2. **Verify documentation** - Update corresponding documentation in `6-DOCUMENTATION/`
3. **Test import patterns** - Ensure relative imports work within the same directory structure
4. **Check for completeness** - Verify all related files (TypeScript, documentation) are present

## Common Tasks

### Component Discovery
```bash
# Find all UI components
find 2-UI-SYSTEM/ -name "*.ts" | head -10

# Find game mechanics
find 3-GAME-MECHANICS/ -name "*.ts" | head -10

# Find base framework components  
find 1-CORE-FRAMEWORK/ -name "*.ts" | head -10
```

### Documentation Navigation
```bash
# Search API documentation
grep -r "specific-topic" 6-DOCUMENTATION/api-guides/

# Check best practices
ls 6-DOCUMENTATION/HorizonWorldsBestPractices/

# List documentation directories
ls 6-DOCUMENTATION/
```

### Pattern Analysis
```bash
# Check component import patterns
grep -h "import.*from" 1-CORE-FRAMEWORK/samples/*.ts

# Find components by functionality
grep -l "Component.*register" --include="*.ts" . -r | head -5
```

## Repository Structure Reference

### Quick Directory Guide
| Directory | Purpose | File Count | Example Files |
|-----------|---------|------------|---------------|
| `1-CORE-FRAMEWORK/` | Base classes, samples | ~34 | BaseComponent.ts, a_Sample_LocalComponent.ts |
| `2-UI-SYSTEM/` | UI components, dialogs | ~164 | CUI.ts, Dialog_UI.ts |
| `3-GAME-MECHANICS/` | Game logic, triggers | ~304 | TriggerComponent.ts, PlayerManager.ts |
| `4-NPC-AI/` | AI and NPC behavior | ~96 | NPCController.ts, AIAgent.ts |
| `5-UTILITIES/` | Helper functions | ~58 | MathUtils.ts, AnimationHelper.ts |
| `6-DOCUMENTATION/` | Guides and references | ~97 | All `.md` files |
| `7-EXAMPLE-PROJECTS/` | Complete examples | ~486 | Complete game implementations |
| `8-PLATFORM-SPECIFIC/` | Platform features | ~126 | Mobile.ts, CameraSystem.ts |

### File Organization Patterns
- **TypeScript files**: Component implementations (`.ts`)
- **Documentation**: Comprehensive guides (`.md`) 
- **Samples**: Working examples in `1-CORE-FRAMEWORK/samples/`
- **Best practices**: Detailed guides in `6-DOCUMENTATION/HorizonWorldsBestPractices/`

## Working with Horizon Worlds Components

### Typical Component Structure
```typescript
import { Component, PropTypes } from 'horizon/core';

class MyComponent extends Component<typeof MyComponent> {
  static propsDefinition = {
    // Properties here
  };

  preStart() {
    // Setup before start
  }

  start() {
    // Main component logic
  }
}

Component.register(MyComponent);
```

### Development Workflow in Horizon Worlds
1. **Copy component** from this repository
2. **Open Horizon Worlds editor** 
3. **Create new script** in Horizon Worlds
4. **Paste component code** into external editor (VS Code)
5. **Save file** - Horizon Worlds auto-compiles
6. **Test in Horizon Worlds** virtual environment

### Component Categories
- **Local Components**: Run on individual clients
- **Server Components**: Run on server authority
- **UI Components**: Handle user interface
- **Trigger Components**: Respond to game events
- **Utility Components**: Provide helper functionality

## Important Notes

### Limitations
- **No traditional builds** - This is a component library, not an application
- **No testing framework** - Components require Horizon Worlds runtime
- **No linting setup** - Would require extensive Horizon Worlds type definitions
- **External dependencies** - Components rely on Horizon Worlds APIs not available in this environment

### Best Practices
- **Always check documentation first** - Extensive guides in `6-DOCUMENTATION/`
- **Use samples as templates** - Working examples in `1-CORE-FRAMEWORK/samples/`
- **Follow naming conventions** - Match existing component patterns
- **Update documentation** - Keep guides current with component changes
- **Organize by function** - Place components in appropriate numbered directories

## Repository Maintenance

### Adding New Components
1. **Identify category** - Choose appropriate numbered directory (1-8)
2. **Follow naming conventions** - Match existing component names
3. **Add documentation** - Create or update relevant `.md` files
4. **Test in Horizon Worlds** - Validate component works in target environment

### Updating Documentation
1. **Check current docs** - Search `6-DOCUMENTATION/` for existing content
2. **Update consistently** - Maintain formatting and structure
3. **Cross-reference** - Link related components and guides
4. **Validate examples** - Ensure code samples are current

This repository contains a wealth of Horizon Worlds TypeScript components and comprehensive documentation. Use the file organization and search capabilities to quickly find relevant components and patterns for your Horizon Worlds development projects.