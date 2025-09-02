# 🗂️ Horizon Worlds TypeScript Repository - Master Index

## 📚 Quick Navigation

| Category                 | Description                    | Count        | Go To                                         |
| ------------------------ | ------------------------------ | ------------ | --------------------------------------------- |
| 🏗️ **Core Framework**    | Foundation classes and samples | 15+ files    | [→ 1-CORE-FRAMEWORK](#1-core-framework)       |
| 🎨 **UI System**         | User interface components      | 50+ files    | [→ 2-UI-SYSTEM](#2-ui-system)                 |
| 🎮 **Game Mechanics**    | Core gameplay systems          | 80+ files    | [→ 3-GAME-MECHANICS](#3-game-mechanics)       |
| 🤖 **NPC & AI**          | AI and character systems       | 20+ files    | [→ 4-NPC-AI](#4-npc-ai)                       |
| 🛠️ **Utilities**         | Helper functions and tools     | 30+ files    | [→ 5-UTILITIES](#5-utilities)                 |
| 📖 **Documentation**     | Guides and references          | 25+ files    | [→ 6-DOCUMENTATION](#6-documentation)         |
| 🎯 **Example Projects**  | Complete games and samples     | 15+ projects | [→ 7-EXAMPLE-PROJECTS](#7-example-projects)   |
| 📱 **Platform Specific** | Mobile, camera, web            | 10+ files    | [→ 8-PLATFORM-SPECIFIC](#8-platform-specific) |

---

## 1-CORE-FRAMEWORK

### 📁 base-components/

**Foundation classes for all TypeScript components**

- `BaseComponent.ts` - Core component base class
- `BaseLogger.ts` - Logging utility base
- `BaseNavigationComponent.ts` - Navigation foundation
- `BaseNPCAnimationComponent.ts` - NPC animation base
- `BaseAssetBundleComponent.ts` - Asset bundle management
- `ContextComponent.ts` - Context management
- `InitialContext.ts` - Initial setup context
- `Server.ts` - Server-side components

### 📁 samples/

**Sample implementations and templates**

- `a_Sample_LocalComponent.ts` - Local component example
- `a_Sample_Module.ts` - Module structure example
- `a_Sample_ServerComponent.ts` - Server component example
- `a_Sample_UILocalComponent.ts` - UI local component example
- `a_Sample_UIServerComponent.ts` - UI server component example

### 📁 Additional Resources

- `types/` - TypeScript type definitions
- `core/` - Core system files
- `unity_asset_bundles/` - Unity asset bundle support

---

## 2-UI-SYSTEM

### 📁 custom-ui-components/

**Custom UI implementations and dialogs**

- `CUI_*.ts` - Custom UI components (20+ files)
- `CustomUI_*.ts` - Custom UI panels and dialogs
- `Dialog*.ts` - Dialog system components
- Entity-based UI components

### 📁 ui-examples/

**UI example implementations**

- `UI_*.ts` - UI examples (Button, Text, Image, etc.)
- `BigBox_UI_*.ts` - BigBox UI system components
- `CrystalBall*.ts` - Interactive UI examples
- `DigitalClock.ts` - Clock UI component
- `inventory_ui.ts` - Inventory interface
- `shop_ui.ts` - Shop interface

### 📁 ui-styles-data/

**UI styling and data components**

- Style definitions and data structures
- UI configuration files
- Theme and styling utilities

### 📁 Additional Resources

- `ui/` - UI system core files
- `Text as Asset/` - Text asset management

---

## 3-GAME-MECHANICS

### 📁 economy-inventory/

**Economy, shop, and inventory systems**

- `BigBox_Inventory_*.ts` - Complete inventory system
- `BigBox_Item*.ts` - Item management
- `StoreCUI.ts` - Store interface
- `AddMoney.ts` - Currency management
- `CurrencyManager.ts` - Currency system
- `shop*.ts` - Shop implementations
- `inventory*.ts` - Inventory systems
- `SimpleLootItem.ts` - Loot mechanics
- `PerceivableItem.ts` - Item perception

### 📁 player-systems/

**Player management and data**

- `Player*.ts` - Player management components
- `Health*.ts` - Health system
- `*Checkpoint*.ts` - Checkpoint system
- `*Respawn*.ts` - Respawn mechanics
- `*Score*.ts` - Scoring system
- `Teams.ts` - Team management
- `*Leaderboard*.ts` - Leaderboard system
- `BotCaptcha.ts` - Bot detection
- `DANCE.ts` - Animation system
- `VisemeTest.ts` - Voice animation

### 📁 triggers-events/

**Event handling and trigger systems**

- `Trigger_*.ts` - Trigger components (25+ files)
- `Events*.ts` - Event system
- `BroadcastEvent.ts` - Event broadcasting
- `DoorTrigger.ts` - Door mechanics
- `HideItem.ts` - Item visibility
- `TSTriggers.ts` - TypeScript triggers

### 📁 physics-movement/

**Physics and movement mechanics**

- `*Jump*.ts` - Jump mechanics
- `*Speed*.ts` - Speed systems
- `Trampoline.ts` - Trampoline physics

### 📁 input-interaction/

**Input handling and interaction**

- `Input_*.ts` - Input system components
- `Grab_*.ts` - Grab interaction system
- `*Drag*.ts` - Drag mechanics
- `InputViewer.ts` - Input debugging

### 📁 world-utilities/

**World management utilities**

- `World_*.ts` - World utility functions (25+ files)
- `Tigger_WorldStreaming.ts` - World streaming
- `SpawningAndPooling/` - Object spawning and pooling
- `world_streaming/` - Streaming system

### 📁 timers-schedulers/

**Timer and scheduling systems**

- `Timer_*.ts` - Timer components
- Scheduling utilities

### 📁 Additional Resources

- `social/` - Social systems

---

## 4-NPC-AI

### 📁 npc-components/

**NPC behavior components**

- `NPC*.ts` - NPC base components
- `Customer*.ts` - Customer NPC behaviors
- `Chicken*.ts` - Animal NPC examples
- `ComputerFriend.ts` - AI companion
- `EgyptianSpider.ts` - Creature NPC
- `ShoulderPet.ts` - Pet system
- `NPC Examples/` - Additional NPC examples
- `Scripted Avatar NPC/` - Avatar-based NPCs

### 📁 ai-agent-systems/

**AI agent systems**

- `avatar_ai_agent/` - Avatar AI system
- `navmesh/` - Navigation mesh system

---

## 5-UTILITIES

### 📁 helper-functions/

**Utility functions and helpers**

- `Util*.ts` - Utility function libraries
- `*Animation*.ts` - Animation helpers
- `FindingEntities.ts` - Entity search utilities
- `GnomePOD_Library.ts` - Library functions
- `ObjectDetector.ts` - Object detection
- `*Color*.ts` - Color utilities

### 📁 math-physics/

**Mathematical and physics utilities**

- `Math*.ts` - Mathematical functions
- `*Physics*.ts` - Physics calculations
- `Rotate*.ts` - Rotation utilities
- `PizzaRotator.ts` - Rotation example
- `waves.ts` - Wave mathematics

### 📁 Additional Resources

- `performance/` - Performance monitoring
- `analytics/` - Analytics systems
- `Animations/` - Animation resources
- `Turbo Analytics/` - Advanced analytics

---

## 6-DOCUMENTATION

### 📁 api-guides/

**API documentation and guides**

- `*.md` files - Comprehensive API documentation
- Getting started guides
- Best practices documentation

### 📁 tutorials/

**Tutorial and learning content**

- Step-by-step tutorials
- Learning materials

### 📁 error-logs/

**Error documentation and troubleshooting**

- Error reference guides
- Debugging documentation

### 📁 Additional Resources

- `HorizonWorldsBestPractices/` - Best practices guide

---

## 7-EXAMPLE-PROJECTS

### 📁 complete-games/

**Full game examples**

- `Economy World Tutorial/` - Complete economy system
- `Brain Games Trivia/` - Trivia game implementation
- `Rooftop_Racers/` - Racing game example
- `AI NPC Profit and PErish/` - AI NPC game
- `Chop_N_Pop/` - Action game example
- `Simple_Shooting_Mechanics/` - Shooting mechanics
- `MultiPlayer Lobby Controls/` - Multiplayer systems
- `Cutsom UI Examples/` - UI examples
- `Pinata.ts` - Pinata game mechanics
- `*Queue*.ts` - Queue system examples
- `Ftue*.ts` - First-time user experience
- `*Game*.ts` - Various game examples

### 📁 archived-zips/

**Archived project folders**

- `*-20250*` directories - Archived project versions
- Historical implementations
- Legacy code examples

---

## 8-PLATFORM-SPECIFIC

### 📁 mobile/

**Mobile-specific components**

- `mobile_gestures/` - Touch and gesture system
- `*Mobile*.ts` - Mobile-specific implementations
- `keyboard.ts` - Virtual keyboard
- `WebanMobilePlayers/` - Web and mobile players

### 📁 camera-systems/

**Camera system implementations**

- `camera/` - Camera system core
- `Camera*.ts` - Camera components
- `Camera API/` - Camera API implementations

---

## 🔍 Search Quick Reference

### By Functionality

| Need...           | Look in...                            |
| ----------------- | ------------------------------------- |
| Base classes      | `1-CORE-FRAMEWORK/base-components/`   |
| UI components     | `2-UI-SYSTEM/ui-examples/`            |
| Custom UI         | `2-UI-SYSTEM/custom-ui-components/`   |
| Player mechanics  | `3-GAME-MECHANICS/player-systems/`    |
| Economy/Shop      | `3-GAME-MECHANICS/economy-inventory/` |
| Triggers/Events   | `3-GAME-MECHANICS/triggers-events/`   |
| Physics           | `3-GAME-MECHANICS/physics-movement/`  |
| Input handling    | `3-GAME-MECHANICS/input-interaction/` |
| World utilities   | `3-GAME-MECHANICS/world-utilities/`   |
| NPC behavior      | `4-NPC-AI/npc-components/`            |
| AI systems        | `4-NPC-AI/ai-agent-systems/`          |
| Helper functions  | `5-UTILITIES/helper-functions/`       |
| Math/Physics      | `5-UTILITIES/math-physics/`           |
| Documentation     | `6-DOCUMENTATION/`                    |
| Complete examples | `7-EXAMPLE-PROJECTS/complete-games/`  |
| Mobile features   | `8-PLATFORM-SPECIFIC/mobile/`         |
| Camera features   | `8-PLATFORM-SPECIFIC/camera-systems/` |

### By File Pattern

| Pattern         | Description        | Location                              |
| --------------- | ------------------ | ------------------------------------- |
| `Base*.ts`      | Foundation classes | `1-CORE-FRAMEWORK/base-components/`   |
| `a_Sample_*.ts` | Code samples       | `1-CORE-FRAMEWORK/samples/`           |
| `UI_*.ts`       | UI examples        | `2-UI-SYSTEM/ui-examples/`            |
| `CUI_*.ts`      | Custom UI          | `2-UI-SYSTEM/custom-ui-components/`   |
| `BigBox_*.ts`   | BigBox system      | Various locations                     |
| `Trigger_*.ts`  | Triggers           | `3-GAME-MECHANICS/triggers-events/`   |
| `Input_*.ts`    | Input handling     | `3-GAME-MECHANICS/input-interaction/` |
| `Grab_*.ts`     | Grab mechanics     | `3-GAME-MECHANICS/input-interaction/` |
| `World_*.ts`    | World utilities    | `3-GAME-MECHANICS/world-utilities/`   |
| `Timer_*.ts`    | Timers             | `3-GAME-MECHANICS/timers-schedulers/` |
| `Player*.ts`    | Player systems     | `3-GAME-MECHANICS/player-systems/`    |
| `NPC*.ts`       | NPC components     | `4-NPC-AI/npc-components/`            |
| `Util*.ts`      | Utilities          | `5-UTILITIES/helper-functions/`       |

---

## 📊 Repository Statistics

- **Total Files**: 300+ TypeScript files
- **Total Projects**: 15+ complete game examples
- **Categories**: 8 main organizational categories
- **Subdirectories**: 25+ specialized subdirectories
- **Documentation Files**: 25+ markdown guides
- **Sample Components**: 5+ template implementations

---

## 🚀 Quick Start Guide

1. **New to Horizon Worlds?** → Start with `6-DOCUMENTATION/api-guides/`
2. **Need a template?** → Check `1-CORE-FRAMEWORK/samples/`
3. **Building UI?** → Explore `2-UI-SYSTEM/ui-examples/`
4. **Adding game mechanics?** → Browse `3-GAME-MECHANICS/`
5. **Working with NPCs?** → See `4-NPC-AI/npc-components/`
6. **Need utilities?** → Check `5-UTILITIES/helper-functions/`
7. **Want complete examples?** → Visit `7-EXAMPLE-PROJECTS/complete-games/`
8. **Platform-specific code?** → Look in `8-PLATFORM-SPECIFIC/`

---

_This index is automatically maintained. Last updated: August 31, 2025_
