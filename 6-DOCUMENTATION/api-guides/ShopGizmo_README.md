# Consumable Shop Gizmo for Horizon Worlds

A comprehensive shop system using the WorldInventory API for Horizon Worlds Desktop Editor.

## Features

✅ **4x2 Grid Layout**: Displays 8 shop items in a clean 4x2 grid format  
✅ **Item Icons**: Each item has a unique emoji icon for quick identification  
✅ **Inventory Integration**: Displays player's current inventory quantities  
✅ **Purchase System**: Functional purchase buttons for each item  
✅ **Real-time Updates**: Live inventory updates after purchases  
✅ **Currency System**: Customizable currency display  
✅ **Responsive UI**: Scrollable grid layout with compact design  
✅ **Purchase Feedback**: Confirmation messages for purchases

## Setup Instructions

### 1. Add the Component

1. Copy `ConsumableShopGizmo.ts` to your scripts folder
2. Add the `ConsumableShopGizmo` as a UIComponent to an entity in your world
3. The entity will serve as your shop interface

### 2. Configure Shop Items

Edit the `SHOP_ITEMS` array in the script to match your items:

```typescript
const SHOP_ITEMS: ShopItem[] = [
  {
    sku: "your_item_sku", // SKU from Creator Portal
    displayName: "Your Item Name", // Display name in shop
    description: "Item description", // Description text
    price: 100, // Price in your currency
    isConsumable: true, // Whether item is consumable
  },
  // Add more items...
];
```

### 3. Creator Portal Setup

1. Go to your world in the Creator Portal
2. Set up your items with the SKUs used in the script
3. Configure pricing and availability

### 4. Customize Appearance

You can customize the shop using these properties:

- `shopTitle`: Title displayed at the top
- `currencyName`: Name of your currency (e.g., "Coins", "Credits")

## Usage

### Opening the Shop for a Player

```typescript
// Get the shop component
const shopComponents = entity.getComponents(ConsumableShopGizmo);
const shop = shopComponents[0];

// Open shop for a specific player
shop.openShopForPlayer(player);
```

### Using the ShopManager Helper

```typescript
const shopManager = new ShopManager();
shopManager.openShopFor(player);
```

## WorldInventory API Methods Used

| Method                           | Purpose                                         |
| -------------------------------- | ----------------------------------------------- |
| `getWorldPurchasablesBySKUs()`   | Retrieves purchasable items from Creator Portal |
| `getPlayerEntitlementQuantity()` | Gets player's current quantity of an item       |
| `grantItemToPlayer()`            | Grants items to a player                        |

## Customization Options

### Adding New Items

1. Add items to the `SHOP_ITEMS` array
2. Set up corresponding SKUs in Creator Portal
3. The shop will automatically display new items

### Currency System

The shop includes a basic currency display. To implement a full currency system:

1. Create a currency item in Creator Portal
2. Modify `updatePlayerCurrency()` method
3. Add currency deduction logic in `purchaseItem()`

### Styling

Modify colors and styling in the `initializeUI()` and `renderShopItem()` methods:

```typescript
backgroundColor: new Color(0.2, 0.2, 0.3),  // RGB values 0-1
borderColor: new Color(0.4, 0.6, 1.0)       // RGB values 0-1
```

## Example Shop Items

The script includes 8 example consumable items displayed in a 4x2 grid:

**Row 1:**

- ❤️ **Health Potion** (100 coins): Restores HP
- 🔮 **Mana Potion** (80 coins): Restores MP
- ⚡ **Speed Boost** (150 coins): Movement speed increase
- ⚔️ **Damage Boost** (200 coins): Attack damage increase

**Row 2:**

- 🛡️ **Shield Scroll** (300 coins): Temporary invincibility
- 🌟 **Teleport Crystal** (250 coins): Instant teleportation
- 🥤 **Energy Drink** (120 coins): Restores stamina
- 🍀 **Luck Charm** (180 coins): Increases drop rates

## Troubleshooting

### Items Not Showing

- Verify SKUs match between script and Creator Portal
- Check that items are published and available
- Ensure `getWorldPurchasablesBySKUs()` is working

### Purchase Not Working

- Verify `grantItemToPlayer()` permissions
- Check player has necessary entitlements
- Review console logs for error messages

### UI Not Displaying

- Ensure ConsumableShopGizmo is added as UIComponent
- Check that `openShopForPlayer()` is being called
- Verify UI bindings are working correctly

## Technical Details

### Components

- **ConsumableShopGizmo**: Main shop UI component
- **ShopManager**: Helper component for managing shop interactions

### Key Methods

- `openShopForPlayer(player)`: Opens shop interface for specific player
- `updatePlayerInventory(player)`: Refreshes player's inventory quantities
- `purchaseItem(item, player)`: Handles item purchases
- `refreshShop()`: Updates shop data from Creator Portal

### Bindings

- `playerCurrency`: Player's current currency amount
- `purchaseMessage`: Status messages for purchases
- `itemQuantities`: Player's inventory quantities
- `currentPlayer`: Currently viewing player

## Notes

- The shop UI uses Horizon's UI components (View, Text, Pressable, etc.)
- All WorldInventory operations are asynchronous
- Purchase confirmations include automatic message clearing
- The system supports both individual items and item packs

## Future Enhancements

Potential improvements you could add:

- Image support for shop items
- Category filtering
- Search functionality
- Bulk purchasing
- Price discounts/sales
- Purchase history
- Admin tools for shop management
