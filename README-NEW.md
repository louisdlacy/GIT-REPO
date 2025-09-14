# Horizon Worlds TypeScript Library - Import-Based Structure

## 🗂️ New Organization System

This library is now organized by **import dependencies** rather than functional categories, optimizing for both human navigation and AI search efficiency.

### 📁 Directory Structure

| Directory | Primary Import | File Count | Description |
|-----------|----------------|------------|-------------|
| `horizon-core/` | `horizon/core` | ~934 files | Core runtime components, managers, systems |
| `horizon-ui/` | `horizon/ui` | ~137 files | User interface components and widgets |
| `horizon-analytics/` | `horizon/analytics` | ~19 files | Analytics and tracking components |
| `horizon-camera/` | `horizon/camera` | ~34 files | Camera system components |
| `horizon-npc/` | `horizon/npc` | ~14 files | NPC and AI behavior components |
| `horizon-navmesh/` | `horizon/navmesh` | ~18 files | Navigation and pathfinding |
| `horizon-assets/` | `horizon/unity_asset_bundles` | ~9 files | Asset bundle management |
| `custom-modules/` | Custom imports | ~402 files | Standalone and custom utilities |
| `cross-references/` | Multi-import | ~216 files | Components using multiple horizons |
| `documentation/` | N/A | ~461 files | Guides, references, and listings |

### 🏷️ Tagging System

Every component now includes standardized tags for efficient search:

**Tag Categories:**
- **Import Tags**: `@horizon-core`, `@horizon-ui`, `@horizon-analytics`, etc.
- **Type Tags**: `@component`, `@manager`, `@system`, `@utility`, `@trigger`
- **Usage Tags**: `@multi-import`, `@standalone`, `@cross-reference`
- **Complexity**: `@simple`, `@intermediate`, `@advanced`

**Example:**
```typescript
/**
 * Player Management System
 * @tags: horizon-core, manager, multi-import, advanced
 * @cross-refs: horizon-ui (for player HUD), horizon-analytics (for tracking)
 */
```

### 🔗 Cross-Reference System

Files using multiple horizon modules are organized in `cross-references/` with:
- Dependency maps showing all relationships
- Usage guides for multi-component scenarios
- Clear navigation to related components

### 📋 File Listings

Each directory includes a comprehensive file listing:
- Alphabetical name lists
- Import dependency information  
- Cross-reference indicators
- Tag summaries

## 🚀 Quick Navigation

**Find by Import Type:**
- Need `horizon/core`? → `horizon-core/`
- Building UI? → `horizon-ui/`  
- Adding analytics? → `horizon-analytics/`
- Complex multi-import? → `cross-references/`

**Find by Component Type:**
- Managers: `horizon-core/managers/`
- UI Widgets: `horizon-ui/widgets/`
- System Files: `horizon-core/systems/`
- Examples: `custom-modules/examples/`

This structure maintains the flexibility developers need while providing the rigid organization AI systems require for efficient token usage and precise search results.

## 🔧 Development Notes

This repository is designed for use with the **Horizon Worlds editor**. Components cannot be compiled or tested outside of the Horizon Worlds environment due to the required `horizon/core` runtime.

### Expected Behavior:
- ❌ `npm run build` - No build scripts (components compile in Horizon Worlds)
- ❌ `npm test` - No test framework (testing done in Horizon Worlds)
- ✅ `npx tsc --noEmit` - Shows expected compilation errors (~2,500+)

---

## 📖 Documentation

Comprehensive documentation is available in the [documentation/](documentation/) directory:
- **Import Guides**: How to use each horizon module
- **Cross-Reference Guides**: Multi-component usage patterns
- **Migration Guide**: Moving from old to new structure
- **Tagging System**: How to use and search with tags
- **File Listings**: Complete directory contents with metadata

*This repository contains components for the Horizon Worlds platform. All components are designed to work within the Horizon Worlds runtime environment.*