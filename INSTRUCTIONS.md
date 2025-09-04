# Horizon Worlds TypeScript Repository - Instructions

## 🎯 Purpose
This repository contains a comprehensive collection of Horizon Worlds TypeScript components, examples, and documentation organized for optimal AI-assisted development.

## 📋 Development Workflow

### Getting Started
1. **Browse by category**: Use the numbered directories (1-8) to find relevant code
2. **Check INDEX.md**: Complete file inventory with navigation links  
3. **Start with samples**: Use `1-CORE-FRAMEWORK/samples/` for templates
4. **Reference documentation**: See `6-DOCUMENTATION/api-guides/` for API usage

### Adding New Components
1. Identify functionality type (UI, game mechanics, AI, etc.)
2. Place in appropriate numbered directory
3. Use existing naming conventions (`Base*.ts`, `UI_*.ts`, `Trigger_*.ts`, etc.)
4. Follow patterns from similar components in the same directory

### Code Standards
- **TypeScript 4.7.4**: Use `npm run build` (if configured)
- **Horizon Worlds API**: Follow existing component patterns
- **Naming Conventions**: Match directory-specific patterns
- **Documentation**: Add to relevant `6-DOCUMENTATION/` subdirectory

### Error Resolution
- Check `6-DOCUMENTATION/error-logs/.Error_LOG.md/` for common issues
- Use `ERROR_LOG_INDEX.md` for systematic troubleshooting
- Follow `ERROR_LOGGING_METHODOLOGY.md` for documenting new errors

## 🔧 Commands
```bash
# Install dependencies
npm install

# TypeScript compilation (if configured)
npx tsc

# Development (check individual project READMEs)
# Many projects are Horizon Worlds components, not standalone apps
```

## 📁 Quick Navigation
- **Foundation**: `1-CORE-FRAMEWORK/` - Base classes and samples
- **UI**: `2-UI-SYSTEM/` - Interface components and examples  
- **Game Logic**: `3-GAME-MECHANICS/` - Core gameplay systems
- **AI/NPCs**: `4-NPC-AI/` - Character and AI systems
- **Utils**: `5-UTILITIES/` - Helper functions and tools
- **Docs**: `6-DOCUMENTATION/` - Guides and error logs
- **Examples**: `7-EXAMPLE-PROJECTS/` - Complete game implementations
- **Platform**: `8-PLATFORM-SPECIFIC/` - Mobile and camera features

## ⚡ Key Files
- `INDEX.md` - Complete file inventory (750+ files)
- `README.md` - Repository organization details
- `tsconfig.json` - TypeScript configuration
- `6-DOCUMENTATION/error-logs/.Error_LOG.md/ERROR_LOG_INDEX.md` - Error reference

## 🎮 Horizon Worlds Development
This repository focuses on Meta's Horizon Worlds platform. Components are designed for:
- VR/AR environments
- Multiplayer social experiences
- Custom UI systems
- NPC/AI interactions
- Cross-platform compatibility (mobile, web, VR)

Refer to Horizon Worlds official documentation alongside this repository's examples and guides.