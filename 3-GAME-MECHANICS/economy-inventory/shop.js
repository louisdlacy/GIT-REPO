"use strict";
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shop = void 0;
// @generated version: NG8KUA
const hz = __importStar(require("horizon/core"));
const ui_1 = require("horizon/ui");
/**
 * Enum representing the possible results of a purchase transaction
 */
var PurchaseResult;
(function (PurchaseResult) {
    /**
     * Indicates that the purchase was successful.
     */
    PurchaseResult["SUCCESS"] = "success";
    /**
     * Indicates that the purchase failed due to insufficient funds.
     * This can only happen if the player is trying to purchase with soft currency.
     */
    PurchaseResult["INSUFFICIENT_FUNDS"] = "insufficient_funds";
    /**
     * Indicates that the purchase failed because the item is invalid.
     */
    PurchaseResult["INVALID_ITEM"] = "invalid_item";
    /**
     * Indicates that the purchase failed because the cost is invalid.
     */
    PurchaseResult["INVALID_COST"] = "invalid_cost";
    /**
     * Indicates that the purchase attempt timed out.
     * Which is not a guarantee of either success or failure.
     * It is recommended to fetch entitlements to confirm the purchase status.
     */
    PurchaseResult["TIMED_OUT"] = "timed_out";
    /**
     * Indicates that the purchase is pending due to an ongoing checkout flow.
     */
    PurchaseResult["PENDING_CHECKOUT_FLOW"] = "pending_checkout_flow";
})(PurchaseResult || (PurchaseResult = {}));
/**
 * Collection of network events used for shop-related communication.
 * These events facilitate the flow of data between client and server
 * for shop listings, purchases, and entitlement management.
 */
const ShopEvents = {
    /**
     * Event triggered when a player requests the list of items in a shop.
     * The id parameter can be used to request a specific shop if multiple shops exist.
     */
    RequestShopList: new hz.NetworkEvent('ShopEvents.RequestShopList'),
    /**
     * Event triggered when a player requests their current entitlements.
     * The id parameter can be used to filter entitlements for a specific shop.
     */
    RequestEntitlements: new hz.NetworkEvent('ShopEvents.RequestEntitlements'),
    /**
     * Event triggered to broadcast shop information to all players.
     * Used for global shop updates or announcements.
     */
    BroadcastShopList: new hz.NetworkEvent('ShopEvents.BroadcastShopList'),
    /**
     * Event triggered to send shop information to a specific player.
     * Response to a RequestShopList event.
     */
    SendShopList: new hz.NetworkEvent('ShopEvents.SendShopList'),
    /**
     * Event triggered to send entitlement information to a specific player.
     * Response to a RequestEntitlements event.
     */
    SendEntitlements: new hz.NetworkEvent('ShopEvents.SendEntitlements'),
    /**
     * Event triggered when a player attempts to purchase an item.
     * Initiates the purchase flow.
     */
    Purchase: new hz.NetworkEvent('ShopEvents.Purchase'),
    /**
     * Event triggered to inform a player about the result of their purchase attempt.
     * The result enum indicates whether the purchase was successful or why not.
     */
    Receipt: new hz.NetworkEvent('ShopEvents.Receipt'),
};
/**
 * ShopLogic class manages the in-game shop functionality.
 *
 * This class handles:
 * - Storing and retrieving available shop items and currencies
 * - Processing purchases using soft currency or real money
 * - Fetching player entitlements (owned items)
 * - Setting up the shop with items and currencies from configuration
 */
class ShopLogic {
    /**
     * Returns all available items in the shop
     * @returns Array of shop items
     */
    get Items() { return this.items; }
    /**
     * Returns all available currencies in the shop
     * @returns Array of currencies
     */
    get Currencies() { return this.currencies; }
    /**
     * Constructor to initialize the ShopLogic with an owner component
     * @param owner The component that owns this shop logic, used to get the async context
     */
    constructor(owner) {
        /**
         * Collection of purchasable items available in the shop
         */
        this.items = [];
        /**
         * Collection of currencies that can be used for purchases
         */
        this.currencies = [];
        /**
         * List of SKUs (Stock Keeping Units) that the shop is interested in tracking
         * This includes both items and currencies
         */
        this.skusOfInterest = [];
        this.owner = owner;
    }
    /**
     * Processes a purchase transaction for a player
     *
     * This method handles two types of purchases:
     * 1. Soft currency purchases - Uses in-game currency
     * 2. Credit purchases - Uses real money via checkout flow
     *
     * @param player The player who is buying the item
     * @param item The item description containing all purchase information
     * @returns Whether the purchase was successful
     */
    async buy(player, item) {
        // Verify the item is valid before proceeding
        if (!item.validated) {
            return PurchaseResult.INVALID_ITEM;
        }
        // Handle soft currency purchase
        if (item.softCurrencyPrice) {
            // Verify the currency is valid
            if (!item.softCurrencyPrice.validated) {
                return PurchaseResult.INVALID_COST;
            }
            // We are casting to number because the quantity returned is actually a BigInt
            const softCurrencyQuantity = Number(await hz.WorldInventory.getPlayerEntitlementQuantity(player, item.softCurrencyPrice.sku));
            const softCurrencyCost = item.softCurrencyPrice.quantity;
            const expectedNewCurrencyQuantity = softCurrencyQuantity - softCurrencyCost;
            // If the player doesn't have enough soft currency, return false
            if (expectedNewCurrencyQuantity < 0) {
                return PurchaseResult.INSUFFICIENT_FUNDS;
            }
            const itemQuantity = Number(await hz.WorldInventory.getPlayerEntitlementQuantity(player, item.sku));
            const expectedNewItemQuantity = itemQuantity + item.quantity;
            // Deduct the soft currency from player's inventory
            await hz.WorldInventory.consumeItemForPlayer(player, item.softCurrencyPrice.sku, item.softCurrencyPrice.quantity);
            // Grant the purchased item to the player
            await hz.WorldInventory.grantItemToPlayer(player, item.sku, item.quantity);
            // Because the backend doesn't support async purchases, we need to manually
            // wait for validation that the purchase was successful, by waiting and comparing the entitlements
            const maxRetries = 10; // Maximum times to retry
            let retries = 0; // Number of retries so far
            while (retries++ < maxRetries
                && (!await this.hasExpectedEntitlements(player, item.softCurrencyPrice.sku, expectedNewCurrencyQuantity)
                    || !await this.hasExpectedEntitlements(player, item.sku, expectedNewItemQuantity))) {
                // Wait for a second before checking again
                if (this.owner != undefined) {
                    await new Promise(r => this.owner.async.setTimeout(r, 1000));
                }
            }
            if (retries > maxRetries) {
                // If we reach here, the purchase couldn't be processed
                return PurchaseResult.TIMED_OUT;
            }
            return PurchaseResult.SUCCESS;
        }
        // Handle real money purchase
        if (item.price.priceInCredits <= 0) {
            return PurchaseResult.INVALID_COST;
        }
        // Launch the payment flow for real money transactions
        hz.InWorldPurchase.launchCheckoutFlow(player, item.sku);
        return PurchaseResult.PENDING_CHECKOUT_FLOW;
    }
    /**
     * Checks asynchronously if a player has the expected entitlements for a given item
     * @param player The player to check
     * @param expectedItemSku The SKU of the item to check
     * @param expectedItemQuantity The expected quantity of the item
     * @returns Whether the player has the expected entitlements
     */
    async hasExpectedEntitlements(player, expectedItemSku, expectedItemQuantity) {
        // We are casting to number because the quantity returned is actually a BigInt
        const quantity = Number(await hz.WorldInventory.getPlayerEntitlementQuantity(player, expectedItemSku));
        return quantity === expectedItemQuantity;
    }
    /**
     * Retrieves all items owned by a player that are relevant to this shop
     *
     * @param player The player whose entitlements to fetch
     * @returns Promise resolving to an array of player entitlements
     */
    async getPlayerEntitlements(player) {
        try {
            // Get all entitlements for the player
            const entitlements = await hz.WorldInventory.getPlayerEntitlements(player);
            // Only return entitlements for items that are part of this shop
            return entitlements.filter(entitlement => this.skusOfInterest.includes(entitlement.sku));
        }
        catch (error) {
            // Return empty array if there's an error fetching entitlements
            return [];
        }
    }
    /**
     * Initializes the shop with items and currencies
     *
     * This method:
     * 1. Collects all SKUs of interest from items and currencies
     * 2. Fetches detailed information about purchasable items from the backend
     * 3. Sets up the currencies available in the shop
     * 4. Sets up the items available in the shop
     *
     * @param serializedItems Array of item descriptions from configuration
     * @param serializedCurrencies Array of currency descriptions from configuration
     * @returns Promise that resolves when setup is complete
     */
    async setupItems(serializedItems, serializedCurrencies) {
        // Filter out items with valid SKUs
        const purchasableItems = serializedItems.filter(item => item.sku);
        // Extract SKUs of soft currencies used for purchases
        const softCurrencyItems = purchasableItems
            .filter(item => item.softCurrencyPrice?.sku)
            .map(item => item.softCurrencyPrice.sku);
        // Extract SKUs of currencies defined in the shop
        const pickedCurrencyItems = serializedCurrencies.filter(currency => currency.sku).map(currency => currency.sku);
        // Combine all SKUs of interest for the shop
        this.skusOfInterest = purchasableItems.map(item => item.sku)
            .concat(softCurrencyItems)
            .concat(pickedCurrencyItems);
        // Fetch detailed information about all purchasable items
        let purchasables = [];
        try {
            purchasables = await hz.WorldInventory.getWorldPurchasablesBySKUs(this.skusOfInterest);
        }
        catch (e) {
            console.error(`Error fetching items: ${e}`);
        }
        // Reset currencies before populating
        this.currencies = [];
        // Populate currencies with detailed information
        for (const serializedCurrency of serializedCurrencies) {
            const purchasable = purchasables.find(p => p.sku === serializedCurrency.sku);
            if (purchasable) {
                // Create currency object with combined information
                const currency = {
                    ...purchasable,
                    thumbnailId: serializedCurrency.thumbnailId,
                    thumbnailVersionId: serializedCurrency.thumbnailVersionId,
                    validated: true,
                    softCurrencyPrice: null // Currencies can't be purchased with other currencies
                };
                this.currencies.push(currency);
            }
            else {
                console.error(`Could not find currency ${serializedCurrency.sku}`);
            }
        }
        // Reset items before populating
        this.items = [];
        // Populate items with detailed information
        for (const purchasableItem of purchasableItems) {
            const purchasable = purchasables.find(p => p.sku === purchasableItem.sku);
            if (purchasable) {
                // Handle soft currency price if applicable
                let softCurrencyPrice = null;
                if (purchasableItem.softCurrencyPrice != null) {
                    // Find the currency in our currencies list
                    const currency = this.currencies.find(p => p.sku === purchasableItem.softCurrencyPrice.sku);
                    if (currency) {
                        // Create soft currency price object
                        softCurrencyPrice = {
                            ...currency,
                            quantity: purchasableItem.softCurrencyPrice.quantity,
                        };
                    }
                    else {
                        console.error(`Could not find currency for item ${purchasableItem.sku}`);
                        continue; // Skip this item if currency not found
                    }
                }
                // Create item object with combined information
                const item = {
                    ...purchasable,
                    softCurrencyPrice,
                    thumbnailId: purchasableItem.thumbnailId,
                    thumbnailVersionId: purchasableItem.thumbnailVersionId,
                    validated: true,
                };
                this.items.push(item);
            }
            else {
                console.error(`Could not find item ${purchasableItem.sku}`);
            }
        }
    }
}
/**
 * Abstract base class for economy server components.
 *
 * This class provides the foundation for implementing economy-related server components
 * with standardized initialization flow and common functionality.
 *
 * @template T The component's configuration type
 * @template TLogic The business logic implementation type
 */
class EconomyServer extends hz.Component {
    constructor() {
        super(...arguments);
        /**
         * The unique identifier for this economy server instance
         */
        this.id = null;
        /**
         * The business logic implementation for this economy server
         */
        this.logic = null;
    }
    /**
     * Gets the unique identifier of this economy server
     * @returns The server's ID or null if not set
     */
    get Id() { return this.id; }
    /**
     * Gets the business logic implementation
     * @returns The logic implementation or null if not initialized
     */
    get Logic() { return this.logic; }
    /**
     * Determines if this server is the intended recipient for a given ID
     * @param id The ID to check against this server
     * @returns True if this server should handle the request (when ID matches or input ID is null)
     */
    isRecipient(id) {
        return (id === null || this.Id === id);
    }
    /**
     * Lifecycle method called before the component starts.
     * Handles initialization of resources and business logic.
     *
     * The initialization sequence:
     * 1. Preloads icon assets if available
     * 2. Initializes the business logic
     * 3. Calls the onInitialized hook for subclass-specific initialization
     */
    async preStart() {
        // Preload the icon asset if one is defined
        if (this.icon) {
            ui_1.ImageSource.fromTextureAsset(this.icon);
        }
        // Initialize the business logic
        this.logic = await this.initializeLogic();
        // Notify subclass that initialization is complete
        this.onInitialized();
    }
    /**
     * Lifecycle method called when the component starts.
     * Currently empty as all initialization is handled in preStart.
     *
     * Implementation of this method is required by the hz.Component base class.
     * @remarks Note that this method will be called before preStart() is over due
     * to the fact that preStart() is exceptionally asynchronous.
     */
    start() { }
}
/**
 * Constant identifier key used for economy server identification
 */
EconomyServer.ID = "Id";
/**
 * Constant key for the displayed title in the UI
 */
EconomyServer.DISPLAYED_TITLE_KEY = "Displayed Title";
/**
 * Constant key for the icon associated with the displayed title
 */
EconomyServer.DISPLAYED_TITLE_ICON = "Displayed Title Icon";
class Shop extends EconomyServer {
    /**
     * Converts item data into a standardized ShopItemDescription object
     *
     * @param sku - Unique identifier for the item
     * @param thumbnail - Image asset for the item
     * @param cost_sku - Currency SKU required to purchase this item (optional)
     * @param cost_quantity - Amount of currency required to purchase this item (optional)
     * @returns A ShopItemDescription object representing the item
     */
    toShopItemDescription({ sku, thumbnail, cost_sku, cost_quantity }) {
        // Create soft currency price object if the item has a cost
        const softCurrencyPrice = (cost_quantity ?? 0) > 0 ? {
            sku: cost_sku ?? '',
            quantity: cost_quantity ?? 0,
            name: '',
            description: '',
            price: { priceInCredits: 0 },
            isPack: false,
            thumbnailId: BigInt(0),
            thumbnailVersionId: BigInt(0),
            validated: false,
            softCurrencyPrice: null // No nested soft currency price
        } : null;
        // Return the complete item description
        return {
            sku: sku,
            quantity: 1, // Default quantity for items is 1
            name: '',
            description: '',
            price: { priceInCredits: 0 },
            isPack: false,
            thumbnailId: thumbnail?.id ?? BigInt(0), // Use thumbnail ID if available
            thumbnailVersionId: thumbnail?.versionId ?? BigInt(0), // Use thumbnail version ID if available
            softCurrencyPrice, // Include soft currency price if applicable
            validated: false
        };
    }
    /**
     * Initializes the shop logic with configured items and currencies
     * This method is called during component initialization
     *
     * @returns Promise resolving to the initialized ShopLogic instance
     */
    async initializeLogic() {
        // Set shop icon and ID from properties
        this.icon = this.props[EconomyServer.DISPLAYED_TITLE_ICON];
        this.id = this.props[EconomyServer.ID];
        // Build array of items to show in the shop from configured properties
        const items = [
            { sku: this.props[Shop.ITEM_1_SKU], thumbnail: this.props[Shop.ITEM_1_THUMBNAIL], cost_sku: this.props[Shop.ITEM_1_COST_SKU], cost_quantity: this.props[Shop.ITEM_1_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_2_SKU], thumbnail: this.props[Shop.ITEM_2_THUMBNAIL], cost_sku: this.props[Shop.ITEM_2_COST_SKU], cost_quantity: this.props[Shop.ITEM_2_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_3_SKU], thumbnail: this.props[Shop.ITEM_3_THUMBNAIL], cost_sku: this.props[Shop.ITEM_3_COST_SKU], cost_quantity: this.props[Shop.ITEM_3_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_4_SKU], thumbnail: this.props[Shop.ITEM_4_THUMBNAIL], cost_sku: this.props[Shop.ITEM_4_COST_SKU], cost_quantity: this.props[Shop.ITEM_4_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_5_SKU], thumbnail: this.props[Shop.ITEM_5_THUMBNAIL], cost_sku: this.props[Shop.ITEM_5_COST_SKU], cost_quantity: this.props[Shop.ITEM_5_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_6_SKU], thumbnail: this.props[Shop.ITEM_6_THUMBNAIL], cost_sku: this.props[Shop.ITEM_6_COST_SKU], cost_quantity: this.props[Shop.ITEM_6_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_7_SKU], thumbnail: this.props[Shop.ITEM_7_THUMBNAIL], cost_sku: this.props[Shop.ITEM_7_COST_SKU], cost_quantity: this.props[Shop.ITEM_7_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_8_SKU], thumbnail: this.props[Shop.ITEM_8_THUMBNAIL], cost_sku: this.props[Shop.ITEM_8_COST_SKU], cost_quantity: this.props[Shop.ITEM_8_COST_QUANTITY] },
        ];
        // Build array of currencies available in the shop
        const currencies = [
            { sku: this.props[Shop.CURRENCY_SKU], thumbnail: this.props[Shop.CURRENCY_THUMBNAIL] }
        ];
        // Preload all item thumbnails to the server for client access
        for (const item of items) {
            if (item.thumbnail) {
                ui_1.ImageSource.fromTextureAsset(item.thumbnail);
            }
        }
        ;
        // Preload all currency thumbnails to the server for client access
        for (const currency of currencies) {
            if (currency.thumbnail) {
                ui_1.ImageSource.fromTextureAsset(currency.thumbnail);
            }
        }
        ;
        // Preload shop icon if available
        if (this.icon) {
            ui_1.ImageSource.fromTextureAsset(this.icon);
        }
        // Initialize shop logic with items and currencies
        const logic = new ShopLogic(this);
        await logic.setupItems(items.map(item => this.toShopItemDescription(item)), currencies.map(currency => this.toShopItemDescription(currency)));
        return logic;
    }
    /**
     * Called when the component is initialized
     * Sets up network event handlers and broadcasts initial shop list
     */
    onInitialized() {
        // Connect network event handlers for shop interactions
        this.connectNetworkBroadcastEvent(ShopEvents.RequestShopList, this.OnShopListRequested.bind(this));
        this.connectNetworkBroadcastEvent(ShopEvents.RequestEntitlements, this.OnEntitlementsRequested.bind(this));
        this.connectNetworkBroadcastEvent(ShopEvents.Purchase, this.OnPurchase.bind(this));
        // Broadcast initial shop list to all clients
        this.broadcastShopList();
    }
    /**
     * Broadcasts the shop list to all connected clients
     * Contains shop metadata, available items, and currencies
     */
    broadcastShopList() {
        this.sendNetworkBroadcastEvent(ShopEvents.BroadcastShopList, {
            id: this.props[Shop.ID],
            metadata: {
                title: this.props[Shop.DISPLAYED_TITLE_KEY],
                titleIconId: this.icon?.id ?? BigInt(0),
                titleIconVersionId: this.icon?.versionId ?? BigInt(0)
            },
            list: this.Logic.Items, // Get available items from shop logic
            currencies: this.Logic.Currencies // Get available currencies from shop logic
        });
    }
    /**
     * Handles client requests for shop list data
     * Sends shop information to the requesting player
     *
     * @param player - The player requesting the shop list
     * @param id - Shop ID to identify which shop is being requested
     */
    OnShopListRequested({ player, id }) {
        if (!this.isRecipient(id)) {
            // Reject this request as it is not aimed at this shop
            return;
        }
        // Send shop information directly to the requesting player
        this.sendNetworkBroadcastEvent(ShopEvents.SendShopList, {
            player: player, // Target specific player
            id: this.props[Shop.ID],
            metadata: {
                title: this.props[Shop.DISPLAYED_TITLE_KEY],
                titleIconId: this.icon?.id ?? BigInt(0),
                titleIconVersionId: this.icon?.versionId ?? BigInt(0)
            },
            list: this.Logic.Items,
            currencies: this.Logic.Currencies
        });
    }
    /**
     * Handles purchase requests from clients
     * Processes the purchase through shop logic and sends receipt
     *
     * @param player - The player making the purchase
     * @param id - Shop ID to identify which shop is handling the purchase
     * @param item - The item being purchased
     */
    async OnPurchase({ player, id, item }) {
        if (!this.isRecipient(id)) {
            // Reject this request as it is not aimed at this shop
            return;
        }
        // Process purchase through shop logic
        const result = await this.Logic.buy(player, item);
        // Send purchase receipt to the player
        this.sendNetworkBroadcastEvent(ShopEvents.Receipt, {
            player: player,
            id: this.props[Shop.ID],
            item: item,
            result: result // Indicates whether purchase was successful
        });
    }
    /**
     * Handles requests for player entitlements
     * Retrieves and sends the player's owned items
     *
     * @param player - The player requesting entitlements
     * @param id - Shop ID to identify which shop is handling the request
     */
    async OnEntitlementsRequested({ player, id }) {
        if (!this.isRecipient(id)) {
            // Reject this request as it is not aimed at this shop
            return;
        }
        // Get player's entitlements (owned items) from shop logic
        const entitlements = await this.Logic.getPlayerEntitlements(player);
        // Send entitlements to the requesting player
        this.sendNetworkBroadcastEvent(ShopEvents.SendEntitlements, {
            player: player,
            id: this.props[Shop.ID],
            list: entitlements // List of items the player owns
        });
    }
}
exports.Shop = Shop;
/**
 * Constants for Item 1 configuration
 * SKU: Unique identifier for the item
 * THUMBNAIL: Asset reference for item's image
 * COST_SKU: Currency SKU used to purchase this item
 * COST_QUANTITY: Amount of currency needed to purchase
 */
Shop.ITEM_1_SKU = "Item 1 SKU";
Shop.ITEM_1_THUMBNAIL = "Item 1 Thumbnail";
Shop.ITEM_1_COST_SKU = "Item 1 Cost SKU";
Shop.ITEM_1_COST_QUANTITY = "Item 1 Cost Quantity";
/**
 * Constants for Item 2 configuration
 */
Shop.ITEM_2_SKU = "Item 2 SKU";
Shop.ITEM_2_THUMBNAIL = "Item 2 Thumbnail";
Shop.ITEM_2_COST_SKU = "Item 2 Cost SKU";
Shop.ITEM_2_COST_QUANTITY = "Item 2 Cost Quantity";
/**
 * Constants for Item 3 configuration
 */
Shop.ITEM_3_SKU = "Item 3 SKU";
Shop.ITEM_3_THUMBNAIL = "Item 3 Thumbnail";
Shop.ITEM_3_COST_SKU = "Item 3 Cost SKU";
Shop.ITEM_3_COST_QUANTITY = "Item 3 Cost Quantity";
/**
 * Constants for Item 4 configuration
 */
Shop.ITEM_4_SKU = "Item 4 SKU";
Shop.ITEM_4_THUMBNAIL = "Item 4 Thumbnail";
Shop.ITEM_4_COST_SKU = "Item 4 Cost SKU";
Shop.ITEM_4_COST_QUANTITY = "Item 4 Cost Quantity";
/**
 * Constants for Item 5 configuration
 */
Shop.ITEM_5_SKU = "Item 5 SKU";
Shop.ITEM_5_THUMBNAIL = "Item 5 Thumbnail";
Shop.ITEM_5_COST_SKU = "Item 5 Cost SKU";
Shop.ITEM_5_COST_QUANTITY = "Item 5 Cost Quantity";
/**
 * Constants for Item 6 configuration
 */
Shop.ITEM_6_SKU = "Item 6 SKU";
Shop.ITEM_6_THUMBNAIL = "Item 6 Thumbnail";
Shop.ITEM_6_COST_SKU = "Item 6 Cost SKU";
Shop.ITEM_6_COST_QUANTITY = "Item 6 Cost Quantity";
/**
 * Constants for Item 7 configuration
 */
Shop.ITEM_7_SKU = "Item 7 SKU";
Shop.ITEM_7_THUMBNAIL = "Item 7 Thumbnail";
Shop.ITEM_7_COST_SKU = "Item 7 Cost SKU";
Shop.ITEM_7_COST_QUANTITY = "Item 7 Cost Quantity";
/**
 * Constants for Item 8 configuration
 */
Shop.ITEM_8_SKU = "Item 8 SKU";
Shop.ITEM_8_THUMBNAIL = "Item 8 Thumbnail";
Shop.ITEM_8_COST_SKU = "Item 8 Cost SKU";
Shop.ITEM_8_COST_QUANTITY = "Item 8 Cost Quantity";
// To add additional items, add additional constants here
// and add them to the Shop component's property definitions
// and the Shop component's initializeLogic() method
/**
 * Constants for Currency 1 configuration
 * This currency can be used to purchase items in the shop
 */
Shop.CURRENCY_SKU = "Soft Currency SKU";
Shop.CURRENCY_THUMBNAIL = "Soft Currency Thumbnail";
// To add additional soft currencies, add additional constants here
// and add them to the Shop component's property definitions
// and the Shop component's initializeLogic() method
/**
 * Property definitions for the Shop component
 * These properties can be configured in the editor and will be used at runtime
 *
 * Properties include:
 * - Shop identification and display properties (ID, title, icon)
 * - Item configurations (SKU, thumbnail, cost currency, cost amount)
 * - Currency configurations (SKU, thumbnail)
 */
Shop.propsDefinition = {
    // Shop identification and display properties
    [EconomyServer.ID]: { type: hz.PropTypes.String },
    [EconomyServer.DISPLAYED_TITLE_KEY]: { type: hz.PropTypes.String },
    [EconomyServer.DISPLAYED_TITLE_ICON]: { type: hz.PropTypes.Asset },
    // Currency 1 configuration
    [Shop.CURRENCY_SKU]: { type: hz.PropTypes.String },
    [Shop.CURRENCY_THUMBNAIL]: { type: hz.PropTypes.Asset },
    // Item 1 configuration
    [Shop.ITEM_1_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_1_THUMBNAIL]: { type: hz.PropTypes.Asset },
    [Shop.ITEM_1_COST_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_1_COST_QUANTITY]: { type: hz.PropTypes.Number },
    // Item 2 configuration
    [Shop.ITEM_2_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_2_THUMBNAIL]: { type: hz.PropTypes.Asset },
    [Shop.ITEM_2_COST_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_2_COST_QUANTITY]: { type: hz.PropTypes.Number },
    // Item 3 configuration
    [Shop.ITEM_3_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_3_THUMBNAIL]: { type: hz.PropTypes.Asset },
    [Shop.ITEM_3_COST_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_3_COST_QUANTITY]: { type: hz.PropTypes.Number },
    // Item 4 configuration
    [Shop.ITEM_4_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_4_THUMBNAIL]: { type: hz.PropTypes.Asset },
    [Shop.ITEM_4_COST_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_4_COST_QUANTITY]: { type: hz.PropTypes.Number },
    // Item 5 configuration
    [Shop.ITEM_5_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_5_THUMBNAIL]: { type: hz.PropTypes.Asset },
    [Shop.ITEM_5_COST_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_5_COST_QUANTITY]: { type: hz.PropTypes.Number },
    // Item 6 configuration
    [Shop.ITEM_6_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_6_THUMBNAIL]: { type: hz.PropTypes.Asset },
    [Shop.ITEM_6_COST_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_6_COST_QUANTITY]: { type: hz.PropTypes.Number },
    // Item 7 configuration
    [Shop.ITEM_7_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_7_THUMBNAIL]: { type: hz.PropTypes.Asset },
    [Shop.ITEM_7_COST_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_7_COST_QUANTITY]: { type: hz.PropTypes.Number },
    // Item 8 configuration
    [Shop.ITEM_8_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_8_THUMBNAIL]: { type: hz.PropTypes.Asset },
    [Shop.ITEM_8_COST_SKU]: { type: hz.PropTypes.String },
    [Shop.ITEM_8_COST_QUANTITY]: { type: hz.PropTypes.Number },
};
/**
 * Register the Shop component with the Horizon framework
 */
hz.Component.register(Shop);
