# Horizon Worlds TypeScript Library - Import-Based Structure

## 🗂️ Restructured Organization System

This library has been completely restructured and organized by **import dependencies** rather than functional categories, optimizing for both human navigation and AI search efficiency.

**Migration Complete**: 1,147+ TypeScript files successfully reorganized from 8 functional directories into 10 import-based categories.

## 🗂️ Directory Structure

### 1-CORE-FRAMEWORK/

Core TypeScript framework components and foundation classes

- **base-components/**: Base classes (BaseComponent, BaseLogger, BaseNavigation, etc.)
- **samples/**: Sample component implementations (a_Sample_LocalComponent, a_Sample_Module, etc.)

### 2-UI-SYSTEM/

All user interface related components and systems

- **custom-ui-components/**: Custom UI implementations (CUI*\*, CustomUI*\*, Dialog components)
- **ui-examples/**: UI example implementations (UI_Button, UI_Text, UI_Image, etc.)
- **ui-styles-data/**: UI styling and data components

### 3-GAME-MECHANICS/

Core game functionality and mechanics

- **economy-inventory/**: Economy, shop, and inventory systems (BigBox*Inventory*\*, StoreCUI, etc.)
- **player-systems/**: Player management and data (PlayerHUD, PlayerManager, PlayerData)
- **triggers-events/**: Event handling and trigger systems (Trigger\_\*, Events, BroadcastEvent)
- **physics-movement/**: Physics and movement mechanics (JumpPad, Trampoline, Speed systems)
- **input-interaction/**: Input handling and interaction (Input*\*, Grab*\*, interaction systems)
- **world-utilities/**: World management utilities (World\_\*, spawning, streaming)
- **timers-schedulers/**: Timer and scheduling systems (Timer\_\*)

### 4-NPC-AI/

AI and NPC (Non-Player Character) systems

- **npc-components/**: NPC behavior components (NPC\__, Customer_, Chicken\*)
- **ai-agent-systems/**: AI agent systems (avatar_ai_agent/)

### 5-UTILITIES/

Helper functions and utility systems

- **helper-functions/**: Utility functions (UtilArray_Func, animation helpers)
- **math-physics/**: Mathematical and physics utilities (rotation, physics calculations)
<<<<<<< HEAD
=======
- **Turbo Analytics/**: Advanced analytics and demo systems (TurboAnalytics, DemoNinja components)
>>>>>>> 02e2aa33e2b20034ee5a40d514525e1f592af96e

### 6-DOCUMENTATION/

Documentation, guides, and error references

- **api-guides/**: API documentation and guides (\*.md files)
- **tutorials/**: Tutorial and learning content
- **error-logs/**: Error documentation and troubleshooting

### 7-EXAMPLE-PROJECTS/

Complete example projects and archived content

- **complete-games/**: Full game examples (Economy World Tutorial, Brain Games Trivia, etc.)
- **archived-zips/**: Archived project folders (_-20250_ directories)

### 8-PLATFORM-SPECIFIC/

Platform-specific implementations

- **mobile/**: Mobile-specific components (mobile_gestures/, Mobile\*.ts)
- **camera-systems/**: Camera system implementations (camera/, Camera\*.ts)

## 🔍 AI Search Optimization Features

### 1. **Semantic Categorization**

Files are grouped by purpose and functionality, making it easier for AI to understand:

- What type of component you're looking for
- Where related functionality exists
- Dependencies between systems

### 2. **Hierarchical Organization**

- Top-level categories (1-8) indicate system priority and dependencies
- Sub-directories provide specific functionality groupings
- Clear naming conventions for easy pattern matching

### 3. **Context-Aware Structure**

- **Core Framework** (1) → Foundation classes and samples
- **UI System** (2) → All user interface components
- **Game Mechanics** (3) → Core gameplay systems
- **NPC/AI** (4) → AI and character systems
- **Utilities** (5) → Helper functions and tools
- **Documentation** (6) → Guides and references
- **Examples** (7) → Complete projects and samples
- **Platform-Specific** (8) → Platform adaptations

## 🚀 Benefits for AI Search

1. **Faster Discovery**: AI can quickly identify the category of functionality needed
2. **Better Context**: Related files are co-located, improving understanding of dependencies
3. **Reduced Noise**: Clear separation reduces irrelevant results in searches
4. **Pattern Recognition**: Consistent naming and organization help AI learn patterns
5. **Scope Limiting**: AI can focus searches on specific categories when appropriate

## 📋 Quick Reference

| Looking for...         | Check Directory        |
| ---------------------- | ---------------------- |
| Base classes, samples  | `1-CORE-FRAMEWORK/`    |
| UI components, dialogs | `2-UI-SYSTEM/`         |
| Game logic, triggers   | `3-GAME-MECHANICS/`    |
| AI, NPC behavior       | `4-NPC-AI/`            |
| Helper functions       | `5-UTILITIES/`         |
| Documentation          | `6-DOCUMENTATION/`     |
| Complete examples      | `7-EXAMPLE-PROJECTS/`  |
| Platform features      | `8-PLATFORM-SPECIFIC/` |

## 🔧 Development Workflow

When adding new files:

1. Identify the primary purpose of the component
2. Place it in the appropriate top-level category
3. Use the sub-directory that best matches its functionality
4. Follow existing naming conventions

This organization is designed to grow with your project while maintaining clear categorization for both human developers and AI assistance systems.

## ✅ Organization Complete

**All files have been successfully organized!** The repository now contains:

- **300+ TypeScript files** categorized by functionality
- **20+ example projects** grouped in complete-games and archived-zips
- **Comprehensive documentation** with API guides and tutorials
- **Platform-specific code** for mobile, web, and camera systems
- **Utility libraries** for common tasks and mathematical operations

The root directory now contains only essential configuration files:

- `package.json` & `package-lock.json` - Node.js dependencies
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Git ignore rules
- `README.md` - This documentation
- `node_modules/` - Dependencies (standard)
- `.vscode/` - VS Code settings (standard)
