# Tagging System Documentation

## Overview

The tagging system provides multiple ways to find and categorize components, optimizing for both human understanding and AI search efficiency.

## Tag Format

All tags are added as JSDoc comments at the top of each file:

```typescript
/**
 * Component Name and Description
 * @tags: primary-tag, secondary-tag, type-tag, complexity-tag
 * @cross-refs: related-module (description), another-module (description)
 * @import-primary: horizon/core
 * @import-secondary: horizon/ui, horizon/analytics
 */
```

## Core Tag Categories

### 1. Import Tags (Primary Classification)

Based on the primary Horizon module used:

- `@horizon-core` - Uses `horizon/core` (934+ files)
- `@horizon-ui` - Uses `horizon/ui` (137+ files) 
- `@horizon-analytics` - Uses `horizon/analytics` (19+ files)
- `@horizon-camera` - Uses `horizon/camera` (34+ files)
- `@horizon-npc` - Uses `horizon/npc` (14+ files)
- `@horizon-navmesh` - Uses `horizon/navmesh` (18+ files)
- `@horizon-assets` - Uses `horizon/unity_asset_bundles` (9+ files)
- `@custom-modules` - No horizon imports or custom modules (402+ files)

### 2. Component Type Tags

Based on the component's purpose and structure:

- `@component` - Standard Horizon component with Component.register()
- `@manager` - Management/coordination components (PlayerManager, GameManager)
- `@system` - System-level components (sysEvents, sysUtils)
- `@utility` - Helper functions and utilities
- `@trigger` - Event triggers and handlers
- `@widget` - Reusable UI widgets
- `@dialog` - Dialog and modal components
- `@hud` - HUD and overlay components
- `@animation` - Animation-related components

### 3. Usage Pattern Tags

Based on how the component is typically used:

- `@multi-import` - Uses multiple horizon modules (216+ files)
- `@standalone` - No external dependencies
- `@cross-reference` - Has relationships with other components
- `@base-class` - Base classes for inheritance
- `@sample` - Example implementations
- `@demo` - Demonstration components
- `@template` - Template for creating new components

### 4. Complexity Tags

Based on implementation complexity:

- `@simple` - Basic implementation, few dependencies
- `@intermediate` - Moderate complexity, some dependencies
- `@advanced` - Complex implementation, many dependencies or advanced patterns

### 5. Platform Tags

Based on platform-specific features:

- `@mobile` - Mobile-optimized components
- `@desktop` - Desktop-specific features
- `@web` - Web platform features
- `@cross-platform` - Works across platforms

### 6. Domain Tags

Based on functional domain:

- `@player` - Player-related functionality
- `@game-mechanics` - Core game logic
- `@ui-framework` - UI framework components
- `@analytics` - Analytics and tracking
- `@ai` - AI and NPC behavior
- `@navigation` - Navigation and pathfinding
- `@economics` - Economy and inventory systems
- `@audio` - Audio and sound systems
- `@visual` - Visual effects and graphics
- `@input` - Input handling
- `@networking` - Network communication

## Tag Usage Examples

### Example 1: Simple Core Component
```typescript
/**
 * Basic Player Health Manager
 * @tags: horizon-core, manager, simple, player
 * @import-primary: horizon/core
 */
import { Component, Player } from 'horizon/core';

class PlayerHealthManager extends Component<typeof PlayerHealthManager> {
  // Implementation
}
Component.register(PlayerHealthManager);
```

### Example 2: Multi-Import UI Component
```typescript
/**
 * Player Status HUD with Analytics
 * @tags: horizon-ui, hud, multi-import, intermediate, player
 * @cross-refs: horizon-core (player data), horizon-analytics (status tracking)
 * @import-primary: horizon/ui
 * @import-secondary: horizon/core, horizon/analytics
 */
import { UIComponent, View } from 'horizon/ui';
import { Player } from 'horizon/core';
import { Analytics } from 'horizon/analytics';

class PlayerStatusHUD extends UIComponent<typeof PlayerStatusHUD> {
  // Implementation
}
Component.register(PlayerStatusHUD);
```

### Example 3: Complex Cross-Platform System
```typescript
/**
 * Advanced Audio Management System
 * @tags: horizon-core, system, advanced, audio, cross-platform, multi-import
 * @cross-refs: horizon-camera (spatial audio), custom-modules (audio utilities)
 * @import-primary: horizon/core
 * @import-secondary: horizon/camera
 */
import * as hz from 'horizon/core';
import LocalCamera from 'horizon/camera';
import { AudioUtils } from '../utilities/AudioUtils';

class AdvancedAudioSystem extends hz.Component<typeof AdvancedAudioSystem> {
  // Complex implementation
}
hz.Component.register(AdvancedAudioSystem);
```

## Searching with Tags

### Command Line Search Examples

```bash
# Find all horizon-core managers
grep -r "@tags:.*horizon-core.*manager" . --include="*.ts"

# Find multi-import components
grep -r "@multi-import" . --include="*.ts"

# Find simple UI components
grep -r "@tags:.*horizon-ui.*simple" . --include="*.ts"

# Find player-related components across all imports
grep -r "@tags:.*player" . --include="*.ts"
```

### AI Search Optimization

Tags are structured to maximize AI search efficiency:

1. **Hierarchical**: Primary tags first, then secondary
2. **Descriptive**: Each tag describes a specific aspect
3. **Consistent**: Same naming patterns across all files
4. **Comprehensive**: Cover all major classification axes

### Tag Maintenance

**Adding New Tags**: Follow existing patterns
- Import tags: `@horizon-[module]`
- Type tags: Lowercase, descriptive nouns
- Pattern tags: Hyphenated descriptive phrases

**Tag Validation**: Ensure consistency
- Use existing tags when possible
- Follow naming conventions
- Keep tags concise but descriptive

## Cross-Reference Tags

Special tags for component relationships:

```typescript
/**
 * @cross-refs: 
 *   - horizon-ui (provides player HUD display)
 *   - horizon-analytics (tracks player events)
 *   - custom-modules/utilities (uses PlayerUtils)
 */
```

## Tag Index

### Most Common Tag Combinations

1. `@horizon-core`, `@component` (500+ files)
2. `@horizon-core`, `@manager` (100+ files)  
3. `@horizon-core`, `@system` (80+ files)
4. `@horizon-ui`, `@component` (70+ files)
5. `@multi-import`, `@horizon-core`, `@horizon-ui` (60+ files)

### Tag Statistics

- Total unique tags: 50+
- Average tags per component: 4-6
- Most tagged category: `@horizon-core` (934 files)
- Most complex category: `@multi-import` (216 files)

This tagging system provides multiple pathways to find components while maintaining structure that both humans and AI systems can efficiently navigate.