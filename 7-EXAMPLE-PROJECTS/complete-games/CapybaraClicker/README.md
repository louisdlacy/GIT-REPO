# Capybara Clicker Game

A fun incremental clicker game for Meta Horizon Worlds where players click on a capybara to earn points and purchase upgrades!

## Features

- **Click-based scoring**: Click on the capybara to earn points
- **Persistent progress**: Player scores and upgrades are saved
- **Upgrade system**: Three types of upgrades to boost your earnings
  - **Better Clicks**: Increase points per click
  - **Auto Clicker**: Earn points automatically over time
  - **Click Multiplier**: Multiply all point gains
- **Beautiful UI**: Clean, themed interface with animations
- **Number formatting**: Large numbers are automatically abbreviated (K, M, B, T)

## Setup Instructions

### 1. Create the Game Entities

In your Horizon Worlds project:

1. **Create the main game controller entity**:
   - Add an empty entity to your world
   - Name it "CapybaraClickerGame"
   - Attach the `CapybaraClickerGame.ts` script to it

2. **Create the clickable capybara entity**:
   - Add a 3D model of a capybara (or any object you want to click)
   - Add a **Trigger Volume** component to make it clickable
   - Name it "Capybara"
   - Make sure it has collision enabled

3. **Create the UI entity**:
   - Add a UI Canvas entity
   - Attach the `CapybaraClickerUI.ts` script to it
   - Set it to "Player Canvas" mode so each player sees their own UI

### 2. Configure the Game Component

On the **CapybaraClickerGame** entity:

1. Set the `capybaraEntity` property to reference your clickable capybara entity
2. Configure optional settings:
   - `variableGroup`: Name for persistent storage (default: "CapybaraScore")
   - `baseClickValue`: Starting points per click (default: 1)
   - `autoClickInterval`: How often auto-clickers run in seconds (default: 1)

### 3. Configure Persistent Storage

1. Go to **Systems > Variable Groups** in Horizon Worlds
2. Create a new **Player Persistent Variable Group**
3. Add the following variables (all type: Number):
   - `CapybaraScore` - Stores player's total score
   - `CapybaraScore_ClickLevel` - Stores click upgrade level
   - `CapybaraScore_AutoClickLevel` - Stores auto-clicker upgrade level
   - `CapybaraScore_MultiplierLevel` - Stores multiplier upgrade level

### 4. Customize the UI (Optional)

On the **CapybaraClickerUI** entity, you can customize:

- `displaySize`: Base font size (default: 60)
- `primaryColor`: Main UI color (default: "#FFB84D" - capybara orange)
- `secondaryColor`: Secondary color (default: "#8B4513" - brown)
- `accentColor`: Accent color for buttons (default: "#4CAF50" - green)
- `showShop`: Whether to show the shop (default: true)

## How to Play

1. **Click the capybara**: Each click earns points based on your click power
2. **Open the shop**: Click the "Open Shop" button at the bottom of the screen
3. **Purchase upgrades**: Buy upgrades to increase your earning potential
   - Start with "Better Clicks" for immediate click improvement
   - Save up for "Auto Clicker" to earn passive income
   - "Click Multiplier" amplifies all your earnings
4. **Watch your score grow**: Numbers are automatically formatted (1,000 = 1K, 1,000,000 = 1M, etc.)

## Upgrade Details

### Better Clicks
- **Effect**: +1 point per click
- **Base Cost**: 10 points
- **Cost Growth**: 1.5x per level
- **Best for**: Early game progression

### Auto Clicker
- **Effect**: +1 point per second (automatic)
- **Base Cost**: 50 points
- **Cost Growth**: 2x per level
- **Best for**: Passive income

### Click Multiplier
- **Effect**: +50% to all point gains
- **Base Cost**: 100 points
- **Cost Growth**: 3x per level
- **Best for**: Late game scaling

## Technical Details

### Files
- `CapybaraClickerGame.ts` - Main game logic component
- `CapybaraClickerUI.ts` - UI component for display and interaction
- `README.md` - This documentation file

### Network Events
The game uses two network events for communication:

1. `scoreUpdateEvent`: Broadcasts score changes to update UI
   - Sent when player clicks or auto-clicker triggers
   - Contains: oldValue, newValue, player, clickValue, autoClickRate

2. `upgradePurchaseEvent`: Sent when player purchases an upgrade
   - Contains: player, upgradeType, cost

### Architecture
- **Game Component**: Handles all game logic, scoring, upgrades, and persistence
- **UI Component**: Displays information and handles player interactions
- **Persistent Storage**: Saves player progress across sessions
- **Event System**: Keeps UI and game logic synchronized

## Troubleshooting

### Clicks not registering
- Make sure the capybara entity has a Trigger Volume component
- Verify the `capybaraEntity` property is set on the game component
- Check that the entity has collision enabled

### UI not showing
- Ensure the UI entity is set to "Player Canvas" mode
- Check that the UI script is attached properly
- Verify the entity is visible and active

### Progress not saving
- Confirm you created all required persistent variables in Variable Groups
- Check that variable names match exactly (case-sensitive)
- Verify the `variableGroup` property matches your variable group name

### Upgrades not working
- Check the console for error messages
- Verify persistent storage variables are created
- Ensure both game and UI components are active

## Customization Ideas

- **Change the theme**: Modify colors to match your world's aesthetic
- **Add more upgrades**: Create new upgrade types in the game component
- **Visual effects**: Add particle effects when clicking
- **Sound effects**: Play audio on clicks and purchases
- **Leaderboards**: Display top players' scores
- **Achievements**: Add milestone rewards
- **Different click targets**: Use multiple entities with different point values

## Credits

Created for Meta Horizon Worlds using TypeScript.

Inspired by classic incremental games like Cookie Clicker.

## Support

For issues or questions:
- Check the Horizon Worlds documentation
- Review the error logs in the console
- Join the Horizon Worlds community discord

Happy clicking!
