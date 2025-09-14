# Cross-Reference Guide: Multi-Import Components

## Overview

This guide documents components that use multiple Horizon modules, requiring understanding of relationships between different import types.

## Multi-Import Categories

### Core + UI Components (Most Common)

Components that combine `horizon/core` functionality with `horizon/ui` interfaces:

#### Located in `cross-references/multi-import-components/core-ui/`

**UI Background Components**:
- `UI_Background.ts`
  - **Primary**: `horizon/core` (component logic)
  - **Secondary**: `horizon/ui` (visual display) 
  - **Purpose**: Background display with core component behavior
  - **Tags**: `@horizon-core`, `@horizon-ui`, `@component`, `@multi-import`
  - **Usage**: UI background that responds to core events

**Progress & Status Components**:
- `UI_ProgressBar.ts`
  - **Primary**: `horizon/core` (progress tracking)
  - **Secondary**: `horizon/ui` (bar visualization)
  - **Purpose**: Visual progress indication with game state integration
  - **Tags**: `@horizon-core`, `@horizon-ui`, `@component`, `@multi-import`
  - **Usage**: Health bars, loading progress, skill meters

- `UI_SpriteAnimator.ts`
  - **Primary**: `horizon/core` (animation control)
  - **Secondary**: `horizon/ui` (sprite rendering)
  - **Purpose**: Animated UI sprites with core timing
  - **Tags**: `@horizon-core`, `@horizon-ui`, `@component`, `@animation`, `@multi-import`
  - **Usage**: Animated icons, character portraits, UI transitions

**Interactive Panels**:
- `colorPanel.ts`
  - **Primary**: `horizon/core` (interaction logic)
  - **Secondary**: `horizon/ui` (color picker interface)
  - **Purpose**: Color selection with game state integration
  - **Tags**: `@horizon-core`, `@horizon-ui`, `@trigger`, `@multi-import`
  - **Usage**: Customization panels, puzzle interfaces

- `colorPanelSolutions.ts`
  - **Primary**: `horizon/core` (solution logic)
  - **Secondary**: `horizon/ui` (visual feedback)
  - **Purpose**: Solution display for color-based puzzles
  - **Tags**: `@horizon-core`, `@horizon-ui`, `@component`, `@multi-import`
  - **Usage**: Puzzle feedback, solution verification

- `RiddlePanel.ts`
  - **Primary**: `horizon/core` (riddle logic)
  - **Secondary**: `horizon/ui` (interface display)
  - **Purpose**: Interactive riddle/puzzle interface
  - **Tags**: `@horizon-core`, `@horizon-ui`, `@trigger`, `@complex`, `@multi-import`
  - **Usage**: Puzzle games, brain teasers, interactive challenges

### Core + Camera Components

Components combining core logic with camera functionality:

#### Located in `cross-references/multi-import-components/core-camera/`

**Camera Management**:
- `sysCameraManagerLocal.ts`
  - **Primary**: `horizon/core` (system management)
  - **Secondary**: `horizon/camera` (camera control)
  - **Purpose**: Local camera management with core system integration
  - **Tags**: `@horizon-core`, `@horizon-camera`, `@manager`, `@system`, `@multi-import`
  - **Usage**: Camera switching, view management, cinematic sequences

### UI + Other Combinations

Components using UI with additional modules:

**UI System Components**:
- `sysHelper.ts`
  - **Primary**: `horizon/ui` (UI utilities)
  - **Secondary**: `horizon/core` (system integration)
  - **Purpose**: UI helper functions with core system access
  - **Tags**: `@horizon-ui`, `@horizon-core`, `@system`, `@utility`, `@multi-import`
  - **Usage**: UI utilities, helper functions

- `sysHelper2.ts`
  - **Primary**: `horizon/ui` (extended UI utilities)  
  - **Secondary**: `horizon/core` (system integration)
  - **Purpose**: Additional UI helper functions
  - **Tags**: `@horizon-ui`, `@horizon-core`, `@system`, `@utility`, `@multi-import`
  - **Usage**: Advanced UI operations, complex UI interactions

## Usage Patterns

### Pattern 1: UI Display + Core Logic
Most common pattern where core component handles game logic and UI handles display:

```typescript
/**
 * @tags: horizon-core, horizon-ui, component, multi-import
 */
import { Component, PropTypes } from 'horizon/core';
import { UIComponent, View } from 'horizon/ui';

// Core handles logic, UI handles display
```

### Pattern 2: System + Specialized Module
System components that need specialized module functionality:

```typescript
/**
 * @tags: horizon-core, horizon-camera, manager, system, multi-import
 */
import * as hz from 'horizon/core';
import LocalCamera from 'horizon/camera';

// System management with specialized functionality
```

### Pattern 3: Trigger + UI Feedback
Interactive triggers with immediate UI feedback:

```typescript
/**
 * @tags: horizon-core, horizon-ui, trigger, multi-import
 */
import { Component, CodeBlockEvents } from 'horizon/core';
import { UIComponent, View } from 'horizon/ui';

// Trigger events with visual feedback
```

## Development Guidelines

### When to Use Multi-Import Components

**✅ Good Candidates**:
- UI components that need game state integration
- Interactive elements with immediate visual feedback  
- System managers that control specialized hardware (camera, audio)
- Complex triggers with rich user interfaces

**❌ Avoid When**:
- Simple display components (use horizon/ui only)
- Pure logic components (use horizon/core only)
- Basic triggers (use horizon/core only)
- Utility functions (use appropriate single module)

### Architecture Recommendations

1. **Primary Import**: Choose the module that handles the core responsibility
2. **Secondary Imports**: Use only what's necessary for integration
3. **Clear Separation**: Keep module-specific code organized
4. **Documentation**: Always document the relationship between modules

### Finding Related Components

**Search for Multi-Import Patterns**:
```bash
# Find all multi-import components
grep -r "@multi-import" . --include="*.ts"

# Find specific combinations
grep -r "@horizon-core.*@horizon-ui" . --include="*.ts"
grep -r "@horizon-core.*@horizon-camera" . --include="*.ts"
```

**Navigate by Relationship**:
- **Cross-references directory**: All multi-import components
- **Primary directories**: Components by main import
- **Tag searches**: Components by functionality

## Migration Notes

### From Old Structure
Multi-import components were previously scattered across functional directories:
- **2-UI-SYSTEM/**: UI-focused but with core logic
- **3-GAME-MECHANICS/**: Core logic but with UI elements
- **8-PLATFORM-SPECIFIC/**: Platform features with core integration

### In New Structure
All multi-import components are systematically organized:
- **Primary location**: Based on main import dependency
- **Cross-reference entry**: Documents all import relationships
- **Clear tagging**: Identifies complexity and relationships

This organization ensures developers can find components both by their primary purpose and their integration requirements.