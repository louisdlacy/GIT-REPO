# Horizon Core Files - Complete Listing

## Directory: `horizon-core/`

Primary import: `horizon/core` | File count: 60+ | Updated: 2024-09-14

### Components (`horizon-core/components/`)

Components that primarily use `horizon/core` with Component.register():

**Multi-Import Components** (⚠️ Also in cross-references):
- `UI_Background.ts` - @tags: horizon-core, horizon-ui, component, multi-import
- `UI_ProgressBar.ts` - @tags: horizon-core, horizon-ui, component, multi-import  
- `UI_SpriteAnimator.ts` - @tags: horizon-core, horizon-ui, component, multi-import
- `colorPanelSolutions.ts` - @tags: horizon-core, horizon-ui, component, multi-import

**Core Components**:
- `InteractionController_README.ts` - @tags: horizon-core, component, documentation
- `SpawnPointController.ts` - @tags: horizon-core, component, simple
- `SpeedController.ts` - @tags: horizon-core, component, simple
- `UI_NumberUp.ts` - @tags: horizon-core, component, ui
- `UI_ProgressBar_README.ts` - @tags: horizon-core, component, documentation
- `UI_SimpleButtonEvent.ts` - @tags: horizon-core, component, ui
- `coach huds.ts` - @tags: horizon-core, component, hud
- `numberpad.ts` - @tags: horizon-core, component, ui

### Managers (`horizon-core/managers/`)

Management and coordination components:

**Multi-Import Managers**:
- `sysCameraManagerLocal.ts` - @tags: horizon-core, horizon-camera, manager, multi-import

**Core Managers**:
- `AudioManager.ts` - @tags: horizon-core, manager, audio
- `CombatManager.ts` - @tags: horizon-core, manager, game-mechanics
- `ControlRoomManager.ts` - @tags: horizon-core, manager, game-mechanics
- `GamePhaseManager.ts` - @tags: horizon-core, manager, game-mechanics
- `GameRulesManager.ts` - @tags: horizon-core, manager, game-mechanics
- `LoadoutManager.ts` - @tags: horizon-core, manager, game-mechanics
- `PersistenceManager.ts` - @tags: horizon-core, manager, data
- `PowerUpManager.ts` - @tags: horizon-core, manager, game-mechanics
- `SpawnManager.ts` - @tags: horizon-core, manager, game-mechanics
- `TeamGameRulesManager.ts` - @tags: horizon-core, manager, game-mechanics
- `TeamManager.ts` - @tags: horizon-core, manager, game-mechanics
- `VFXManager.ts` - @tags: horizon-core, manager, visual
- `WorldInteractionManager.ts` - @tags: horizon-core, manager, interaction
- `sysAccessibilityManager.ts` - @tags: horizon-core, manager, system, accessibility
- `sysEconomyManager.ts` - @tags: horizon-core, manager, system, economics
- `sysFocusedInteractionManagerLocal.ts` - @tags: horizon-core, manager, system, interaction
- `sysFocusedInteractionManagerServer.ts` - @tags: horizon-core, manager, system, interaction
- `sysGameStateManager.ts` - @tags: horizon-core, manager, system, game-mechanics
- `sysGlobalEventManager.ts` - @tags: horizon-core, manager, system, events
- `sysHUDManager.ts` - @tags: horizon-core, manager, system, ui
- `sysObjectiveManager.ts` - @tags: horizon-core, manager, system, game-mechanics
- `sysPlayerManager.ts` - @tags: horizon-core, manager, system, player
- `sysPlayerManager2.ts` - @tags: horizon-core, manager, system, player
- `sysPlayerStatsManager.ts` - @tags: horizon-core, manager, system, player
- `sysShopManager.ts` - @tags: horizon-core, manager, system, economics

### Systems (`horizon-core/systems/`)

System-level components and utilities:

- `sysConfiguration.ts` - @tags: horizon-core, system, configuration
- `sysEvents.ts` - @tags: horizon-core, system, events
- `sysEvents2.ts` - @tags: horizon-core, system, events
- `sysInventory.ts` - @tags: horizon-core, system, inventory
- `sysObjectPoolUtil.ts` - @tags: horizon-core, system, utility, object-pool
- `sysUtils.ts` - @tags: horizon-core, system, utility
- `sysUtils2.ts` - @tags: horizon-core, system, utility

### Triggers (`horizon-core/triggers/`)

Event triggers and handlers:

**Multi-Import Triggers**:
- `RiddlePanel.ts` - @tags: horizon-core, horizon-ui, trigger, multi-import
- `colorPanel.ts` - @tags: horizon-core, horizon-ui, trigger, multi-import

**Core Triggers**:
- `ElevatorSystem.ts` - @tags: horizon-core, trigger, advanced, system
- `FallRespawnTrigger.ts` - @tags: horizon-core, trigger, respawn
- `FeaturesLab_CustomInput.ts` - @tags: horizon-core, trigger, input
- `HintTrigger.ts` - @tags: horizon-core, trigger, ui
- `LaunchPadScript.ts` - @tags: horizon-core, trigger, simple
- `Lever.ts` - @tags: horizon-core, trigger, interaction
- `Mon4Tracker.ts` - @tags: horizon-core, trigger, tracking
- `ObjectPool.ts` - @tags: horizon-core, trigger, utility, object-pool
- `PigTracker.ts` - @tags: horizon-core, trigger, tracking
- `PlaceItemsMutli.ts` - @tags: horizon-core, trigger, complex, items
- `itemcollection.ts` - @tags: horizon-core, trigger, collection
- `multiPressurePlate.ts` - @tags: horizon-core, trigger, interaction
- `respawn.ts` - @tags: horizon-core, trigger, respawn

## Usage Patterns

### By Import Complexity

**Single Import (horizon/core only)**: 51 files
- Pure horizon/core components
- No cross-module dependencies
- Easiest to understand and maintain

**Multi-Import (horizon/core + others)**: 9 files  
- Combined horizon/core + horizon/ui functionality
- Located in cross-references for complex relationships
- Require understanding of multiple horizon modules

### By Component Type

**Managers**: 22 files - System coordination and state management
**Triggers**: 17 files - Event handling and user interactions  
**Components**: 12 files - Reusable UI and game components
**Systems**: 7 files - Low-level system functionality

### Common Patterns

1. **System Managers**: Files starting with `sys*` - system-level management
2. **Game Managers**: Core game logic coordination
3. **UI Triggers**: Interactive UI elements that respond to events
4. **Utility Systems**: Helper systems for common functionality

## Cross-References

Files in this directory that also appear in cross-references:
- `/cross-references/multi-import-components/core-ui/` - 9 files
- Related horizon-ui components in `/horizon-ui/` directory
- Custom utilities in `/custom-modules/utilities/`

## Search Tips

**Find by functionality**:
```bash
# Find all managers
find horizon-core/managers/ -name "*.ts"

# Find system files  
find horizon-core/systems/ -name "sys*.ts"

# Find player-related components
grep -r "@tags:.*player" horizon-core/
```

**Find by complexity**:
```bash
# Find simple components
grep -r "@tags:.*simple" horizon-core/

# Find multi-import components
grep -r "multi-import" horizon-core/
```