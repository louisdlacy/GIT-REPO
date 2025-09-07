# Horizon Worlds TypeScript Component Library

**ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Repository Overview
This is a **Horizon Worlds TypeScript component library** containing **1,389 TypeScript files** organized into 8 functional categories. This is NOT a traditional web application - files are meant to be used individually in the Horizon Worlds editor, not built as a monolithic project.

### Environment Setup - NO BUILD REQUIRED
- **DO NOT attempt to build this repository** - It contains Horizon Worlds components that require the Horizon Worlds runtime environment
- **DO NOT run `npm run build`, `npm test`, or `tsc --build`** - TypeScript compilation will fail with 2,500+ expected errors due to missing `horizon/core` modules  
- **DO NOT attempt to install additional dependencies** - The repository intentionally uses minimal dependencies: only `typescript@4.7.4` as a dev dependency
- **TypeScript compilation happens in the Horizon Worlds editor**, not in this repository
- **No npm scripts are defined** - `package.json` contains only devDependencies

### Essential Commands That Work (VALIDATED TIMINGS)
- **File exploration**: `find . -name "*.ts" | head -20` - Lists TypeScript components (**completes in 0.003s**)
- **Total file count**: `find . -name "*.ts" | wc -l` - Shows 1,389 TypeScript files (**completes in 0.009s**)
- **Documentation search**: `grep -r "pattern" 6-DOCUMENTATION/` - Search 99 documentation files (**completes in 0.003s**)
- **Component search**: `find . -name "*Player*" -type f` - Find specific components by name (**completes in 0.005s**)
- **Pattern analysis**: `grep -l "import.*horizon" --include="*.ts" . -r | wc -l` - Shows 816 files use Horizon APIs (**completes in 0.019s**)
- **Repository structure**: `ls -la` - Root directory listing (**completes in 0.003s**)

### Essential Timeouts and Expectations
- **NEVER CANCEL FILE OPERATIONS**: All file searches complete in <0.02 seconds
- **NEVER CANCEL DOCUMENTATION SEARCHES**: Complete in <0.01 seconds  
- **NEVER CANCEL DIRECTORY LISTINGS**: Complete in <0.005 seconds
- **ALWAYS use default timeouts**: Operations complete instantly, no extended timeouts needed
- **npm operations take 0.1-0.3 seconds**: Use standard timeouts for npm commands

## Validation

### What You CAN Validate
- **File organization and structure** - Verify components are in correct directories
- **Documentation accuracy** - Check if documentation matches component implementations  
- **Import patterns** - Analyze how components reference each other
- **Code style consistency** - Check naming conventions and patterns
- **Component completeness** - Verify all necessary files are present
- **Dependency validation** - Run `npm list --depth=0` to verify only typescript@4.7.4 is installed

### What You CANNOT Validate  
- **TypeScript compilation** - Files use `horizon/core` modules not available outside Horizon Worlds
- **Runtime behavior** - Components require Horizon Worlds virtual environment
- **Unit testing** - No test framework exists and cannot be added due to runtime dependencies
- **Build processes** - No build system exists or is needed
- **Linting** - Would require extensive Horizon Worlds type definitions not available
- **npm scripts** - No scripts are defined in package.json

### Manual Validation Requirements ⚠️ CRITICAL
After making changes to components, ALWAYS run these validation steps:

#### File Organization Validation
1. **Check file placement** - Ensure components are in appropriate numbered directories (1-8)
2. **Verify naming conventions** - Component names should match existing patterns
3. **Check for completeness** - Verify all related files (TypeScript, documentation) are present

#### Documentation Validation  
1. **Update documentation** - Update corresponding documentation in `6-DOCUMENTATION/`
2. **Cross-reference validation** - Ensure examples in docs match actual component code
3. **Search existing docs** - `grep -r "ComponentName" 6-DOCUMENTATION/` to find related content

#### Import Pattern Validation
1. **Test import patterns** - Ensure relative imports work within the same directory structure
2. **Validate horizon imports** - Check `import { ... } from 'horizon/core'` syntax matches existing patterns
3. **Component registration** - Ensure `Component.register(ComponentName)` is present

#### Compilation Expectation Validation
1. **Verify compilation fails correctly** - Run `npx tsc --noEmit` and expect 2,500+ errors
2. **Check error types** - Errors should be "Cannot find module 'horizon/core'" type errors
3. **No syntax errors** - Should not see TypeScript syntax errors, only missing module errors

### USER SCENARIO TESTING ⚠️ REQUIRED
After any component changes, test these scenarios:

#### Scenario 1: Component Discovery Workflow
```bash
# Find the component type you modified
find . -name "*YourComponent*" -type f
# Verify it appears in correct directory (1-8)
# Check documentation exists
grep -r "YourComponent" 6-DOCUMENTATION/
```

#### Scenario 2: Import Pattern Verification  
```bash
# Check component uses correct import patterns
grep -n "import.*horizon" path/to/YourComponent.ts
# Verify component registration exists
grep -n "Component.register" path/to/YourComponent.ts
```

#### Scenario 3: Documentation Consistency Check
```bash
# Find related documentation
find 6-DOCUMENTATION/ -name "*.md" -exec grep -l "YourComponent" {} \;
# Verify examples in docs match component implementation
```

## Common Tasks

### Component Discovery (ALL COMMANDS VALIDATED ✅)
```bash
# Find all UI components - NEVER CANCEL: completes in 0.003s
find 2-UI-SYSTEM/ -name "*.ts" | head -10

# Find game mechanics - NEVER CANCEL: completes in 0.002s  
find 3-GAME-MECHANICS/ -name "*.ts" | head -10

# Find base framework components - NEVER CANCEL: completes in 0.002s
find 1-CORE-FRAMEWORK/ -name "*.ts" | head -10

# Count files by type - NEVER CANCEL: each completes in <0.01s
find . -name "*.ts" | wc -l     # 1,389 TypeScript files
find . -name "*.d.ts" | wc -l   # 716 definition files  
find . -name "*.js" | wc -l     # 643 JavaScript files
find . -name "*.md" | wc -l     # 459 documentation files
```

### Documentation Navigation (ALL COMMANDS VALIDATED ✅)
```bash
# Search API documentation - NEVER CANCEL: completes in 0.003s
grep -r "Component" 6-DOCUMENTATION/api-guides/ | head -5

# Check best practices - NEVER CANCEL: completes instantly
ls 6-DOCUMENTATION/HorizonWorldsBestPractices/

# List documentation directories - NEVER CANCEL: completes instantly  
ls 6-DOCUMENTATION/

# Count documentation lines - NEVER CANCEL: completes in 0.008s
wc -l 6-DOCUMENTATION/**/*.md
```

### Pattern Analysis (ALL COMMANDS VALIDATED ✅)
```bash
# Check component import patterns - NEVER CANCEL: completes in 0.002s
grep -h "import.*from" 1-CORE-FRAMEWORK/samples/*.ts

# Find components by functionality - NEVER CANCEL: completes in 0.005s
grep -l "Component.*register" --include="*.ts" . -r | head -5

# Search for specific component types - NEVER CANCEL: completes in 0.005s
find . -name "*Player*" -type f | head -10
find . -name "*UI*" -type f | head -10
find . -name "*Trigger*" -type f | head -10
```

### Development Workflow Commands (ALL COMMANDS VALIDATED ✅)
```bash
# Check repository status - NEVER CANCEL: completes instantly
ls -la

# Verify dependencies - NEVER CANCEL: completes in 0.326s
npm list --depth=0

# Verify TypeScript compilation fails correctly - NEVER CANCEL: completes in ~10s, expect 2,500+ errors
npx tsc --noEmit

# Check file organization - NEVER CANCEL: completes in 0.005s
find . -type d | head -20
```

## Repository Structure Reference

### Quick Directory Guide (VALIDATED FILE COUNTS ✅)
| Directory | Purpose | File Count | Example Files |
|-----------|---------|------------|---------------|
| `1-CORE-FRAMEWORK/` | Base classes, samples | ~34 | BaseComponent.ts, a_Sample_LocalComponent.ts |
| `2-UI-SYSTEM/` | UI components, dialogs | ~164 | CUI.ts, Dialog_UI.ts |
| `3-GAME-MECHANICS/` | Game logic, triggers | ~304 | TriggerComponent.ts, PlayerManager.ts |
| `4-NPC-AI/` | AI and NPC behavior | ~96 | NPCController.ts, AIAgent.ts |
| `5-UTILITIES/` | Helper functions | ~58 | MathUtils.ts, AnimationHelper.ts |
| `6-DOCUMENTATION/` | Guides and references | **99 .md files** | All `.md` files |
| `7-EXAMPLE-PROJECTS/` | Complete examples | ~486 | Complete game implementations |
| `8-PLATFORM-SPECIFIC/` | Platform features | ~126 | Mobile.ts, CameraSystem.ts |

**TOTAL: 1,389 TypeScript files + 716 .d.ts files + 643 .js files + 459 .md files**

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

### What Works vs What Doesn't ⚠️ CRITICAL INFORMATION

#### ✅ WHAT WORKS (All validated and timed):
- **File exploration and search** - All operations complete in <0.02 seconds
- **Documentation navigation** - 99 .md files, searches complete instantly
- **Pattern analysis** - Import pattern searches, component discovery
- **Dependency verification** - `npm list` shows only typescript@4.7.4
- **Repository structure analysis** - Directory listings, file counts
- **Component organization validation** - Verify correct directory placement

#### ❌ WHAT DOES NOT WORK (By design):
- **TypeScript compilation** - `npx tsc --noEmit` fails with 2,500+ expected errors
- **npm build scripts** - No scripts defined in package.json
- **Unit testing** - No test framework exists or can be added
- **Linting** - Would require Horizon Worlds type definitions not available
- **Runtime execution** - Components require Horizon Worlds environment
- **Traditional build processes** - This is a component library, not an application

#### ⚠️ EXPECTED FAILURES (Do not try to fix):
- **Missing `horizon/core` modules** - These only exist in Horizon Worlds editor
- **TypeScript compilation errors** - Expected and intentional
- **No npm scripts** - Intentionally minimal setup
- **No test command** - Testing happens in Horizon Worlds, not this repository

### Build and Test Expectations 🚫 DO NOT BUILD
- **NEVER run `npm run build`** - No build script exists
- **NEVER run `npm test`** - No test script exists  
- **NEVER run `tsc --build`** - Will fail with 2,500+ errors
- **NEVER attempt to add build tools** - Components compile in Horizon Worlds editor only
- **DO run `npx tsc --noEmit`** - To verify expected compilation failure (takes ~10 seconds)

### Timeout Recommendations ⏱️ VALIDATED TIMINGS
- **File operations**: Use default timeout (all complete in <0.02s)
- **npm operations**: Use default timeout (complete in 0.1-0.3s)  
- **TypeScript compilation check**: Use 30s timeout (fails in ~10s as expected)
- **Documentation searches**: Use default timeout (complete instantly)
- **Directory listings**: Use default timeout (complete instantly)

**NEVER CANCEL any file operation - they complete almost instantly**

### Best Practices 📋 MANDATORY WORKFLOWS
- **ALWAYS check documentation first** - Extensive guides in `6-DOCUMENTATION/` (99 files)
- **ALWAYS use samples as templates** - Working examples in `1-CORE-FRAMEWORK/samples/`
- **ALWAYS follow naming conventions** - Match existing component patterns
- **ALWAYS update documentation** - Keep guides current with component changes
- **ALWAYS organize by function** - Place components in appropriate numbered directories (1-8)
- **ALWAYS validate component registration** - Ensure `Component.register(ComponentName)` is present
- **ALWAYS check import patterns** - Use `import { ... } from 'horizon/core'` syntax
- **NEVER attempt to build or test** - Components work only in Horizon Worlds editor

## Repository Maintenance 🔧 STEP-BY-STEP WORKFLOWS

### Adding New Components (Follow ALL steps):
1. **Identify category** - Choose appropriate numbered directory (1-8) based on functionality
2. **Follow naming conventions** - Match existing component names in that directory
3. **Use correct imports** - `import { Component, PropTypes } from 'horizon/core';`
4. **Include component registration** - End with `Component.register(YourComponent);`
5. **Add documentation** - Create or update relevant `.md` files in `6-DOCUMENTATION/`
6. **Validate file placement** - Run `find . -name "*YourComponent*" -type f` to verify location
7. **Test in Horizon Worlds** - Components can only be validated in the Horizon Worlds editor

### Updating Documentation (Follow ALL steps):
1. **Search existing docs** - `grep -r "ComponentName" 6-DOCUMENTATION/` to find related content
2. **Check current structure** - `ls 6-DOCUMENTATION/` to see organization
3. **Update consistently** - Maintain formatting and structure of existing files
4. **Cross-reference** - Link related components and guides
5. **Validate examples** - Ensure code samples match actual component implementations
6. **Check documentation count** - `find 6-DOCUMENTATION/ -name "*.md" | wc -l` should show 99 files

### Validation Checklist ✅ RUN EVERY TIME:
After making ANY changes, run these validation commands:

```bash
# 1. Verify file placement (completes in 0.005s)
find . -name "*YourComponent*" -type f

# 2. Check documentation exists (completes in 0.003s)  
grep -r "YourComponent" 6-DOCUMENTATION/

# 3. Validate import patterns (completes instantly)
grep -n "import.*horizon" path/to/YourComponent.ts

# 4. Confirm component registration (completes instantly)
grep -n "Component.register" path/to/YourComponent.ts

# 5. Verify expected compilation failure (completes in ~10s)
npx tsc --noEmit

# 6. Check repository structure integrity (completes in 0.005s)
find . -type d | head -20
```

This repository contains a wealth of Horizon Worlds TypeScript components and comprehensive documentation. Use the file organization and search capabilities to quickly find relevant components and patterns for your Horizon Worlds development projects.

## 🚀 Quick Start Summary
**For developers new to this repository:**

1. **Explore the structure**: `ls -la` (3ms) → See 8 organized directories  
2. **Find TypeScript components**: `find . -name "*.ts" | head -20` (3ms) → Browse 1,389 components
3. **Search documentation**: `grep -r "topic" 6-DOCUMENTATION/` (3ms) → Search 99 guides
4. **Check samples**: `ls 1-CORE-FRAMEWORK/samples/` → See component templates
5. **Verify setup**: `npm list --depth=0` (326ms) → Confirm typescript@4.7.4 only
6. **Test expected failure**: `npx tsc --noEmit` (10s) → Expect 2,500+ errors (normal!)

**Remember: This is a component library for Horizon Worlds - components are used individually in the Horizon Worlds editor, not built as a traditional application.**