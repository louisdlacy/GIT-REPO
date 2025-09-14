# Migration Guide: Old Structure → New Import-Based Structure

## Overview

This guide maps the old functional directory structure to the new import-based organization.

## Directory Mapping

### Old → New Structure

| Old Directory | New Primary Location | Secondary Locations |
|---------------|---------------------|-------------------|
| `1-CORE-FRAMEWORK/` | `horizon-core/samples/` | `documentation/` |
| `2-UI-SYSTEM/` | `horizon-ui/` | `cross-references/core-ui/` |
| `3-GAME-MECHANICS/` | `horizon-core/managers/` | `horizon-core/systems/` |
| `4-NPC-AI/` | `horizon-npc/` | `horizon-navmesh/` |
| `5-UTILITIES/` | `custom-modules/utilities/` | All directories `/utilities/` |
| `6-DOCUMENTATION/` | `documentation/` | N/A |
| `7-EXAMPLE-PROJECTS/` | `custom-modules/examples/` | N/A |
| `8-PLATFORM-SPECIFIC/` | `custom-modules/cross-platform/` | Various by import |

## File Type Mapping

### Component Types → New Locations

**Core Components** (`horizon/core` import):
- Managers: `horizon-core/managers/`
- System files (sys*): `horizon-core/systems/`
- Base components: `horizon-core/components/`
- Utilities: `horizon-core/utilities/`
- Triggers: `horizon-core/triggers/`
- Samples: `horizon-core/samples/`

**UI Components** (`horizon/ui` import):
- UI components: `horizon-ui/components/`
- Dialogs: `horizon-ui/dialogs/`
- HUD elements: `horizon-ui/huds/`
- UI animations: `horizon-ui/animations/`
- Widgets: `horizon-ui/widgets/`

**Multi-Import Components**:
- Core + UI: `cross-references/multi-import-components/core-ui/`
- Core + Analytics: `cross-references/multi-import-components/core-analytics/`
- 3+ imports: `cross-references/multi-import-components/complex/`

## Search Translation

### Old Search → New Search

**Finding Components by Function** (OLD):
```bash
# Old way
find 3-GAME-MECHANICS/ -name "*Player*"
find 2-UI-SYSTEM/ -name "*Dialog*"
```

**Finding Components by Import** (NEW):
```bash
# New way - more precise
find horizon-core/ -name "*Player*"     # Core player components
find horizon-ui/ -name "*Dialog*"       # UI dialogs
find cross-references/ -name "*Player*" # Multi-import player components
```

**Finding by Component Type**:
```bash
# Old way - scattered across directories
find . -name "*Manager*.ts"

# New way - organized by import and type
find horizon-core/managers/ -name "*.ts"
find horizon-ui/managers/ -name "*.ts"
```

## Tagging Translation

### Functional Tags → Import Tags

| Old Functional Category | New Import Tags | Additional Tags |
|-------------------------|-----------------|-----------------|
| Core Framework | `@horizon-core`, `@component` | `@sample`, `@base` |
| UI System | `@horizon-ui`, `@component` | `@widget`, `@dialog` |
| Game Mechanics | `@horizon-core`, `@manager` | `@system`, `@trigger` |
| NPC AI | `@horizon-npc`, `@ai` | `@navigation`, `@behavior` |
| Utilities | `@utility`, `@helper` | `@standalone`, `@cross-platform` |
| Examples | `@example`, `@demo` | `@complete-project` |
| Platform Specific | `@platform-specific` | `@mobile`, `@camera` |

## File Lookup Examples

### Example 1: Finding Player Management
**OLD**: Search across 3-GAME-MECHANICS/player-systems/
**NEW**: 
- Primary: `horizon-core/managers/` (for core player logic)
- Secondary: `cross-references/core-ui/` (if UI integration)
- Tags: `@horizon-core`, `@manager`, `@player`

### Example 2: Finding UI Components
**OLD**: Search 2-UI-SYSTEM/
**NEW**: 
- Primary: `horizon-ui/components/`
- Multi-import: `cross-references/core-ui/`
- Tags: `@horizon-ui`, `@component`

### Example 3: Finding Analytics
**OLD**: Scattered across directories
**NEW**:
- Primary: `horizon-analytics/`
- Tags: `@horizon-analytics`, `@tracking`

## Automated Migration Commands

```bash
# Find files in old structure and their new locations
./scripts/find-new-location.sh "PlayerManager.ts"
./scripts/find-by-tag.sh "@horizon-core @manager"

# List all files that moved to specific directories
./scripts/list-moved-files.sh "horizon-core/managers/"
```

## Benefits of New Structure

1. **Import-Based Organization**: Find files by what they actually import/use
2. **Cross-Reference System**: Handle multi-import components systematically
3. **Tagging System**: Multiple ways to find the same component
4. **AI Optimization**: Structure matches code dependencies for better AI understanding
5. **Token Efficiency**: Hierarchical organization reduces search scope

## Common Migration Patterns

### Pattern 1: Single Import Component
```typescript
// File: GameManager.ts
import { Component } from 'horizon/core';
// OLD: 3-GAME-MECHANICS/managers/
// NEW: horizon-core/managers/
```

### Pattern 2: Multi-Import Component  
```typescript
// File: PlayerHUD.ts
import { Component } from 'horizon/core';
import { UIComponent } from 'horizon/ui';
// OLD: 2-UI-SYSTEM/ or 3-GAME-MECHANICS/
// NEW: cross-references/multi-import-components/core-ui/
```

### Pattern 3: Custom Modules
```typescript
// File: MathUtils.ts
// No horizon imports
// OLD: 5-UTILITIES/
// NEW: custom-modules/utilities/
```