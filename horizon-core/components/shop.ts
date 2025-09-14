/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

// @generated version: NG8KUA

import * as hz from 'horizon/core';
import { Component, TextureAsset } from 'horizon/core';
import { ImageSource } from 'horizon/ui';

/**
 * Enum representing the possible results of a purchase transaction
 */
enum PurchaseResult {
    /**
     * Indicates that the purchase was successful.
     */
    SUCCESS = 'success',

    /**
     * Indicates that the purchase failed due to insufficient funds.
     * This can only happen if the player is trying to purchase with soft currency.
     */
    INSUFFICIENT_FUNDS = 'insufficient_funds',

    /**
     * Indicates that the purchase failed because the item is invalid.
     */
    INVALID_ITEM = 'invalid_item',

    /**
     * Indicates that the purchase failed because the cost is invalid.
     */
    INVALID_COST = 'invalid_cost',

    /**
     * Indicates that the purchase attempt timed out.
     * Which is not a guarantee of either success or failure.
     * It is recommended to fetch entitlements to confirm the purchase status.
     */
    TIMED_OUT = 'timed_out',

    /**
     * Indicates that the purchase is pending due to an ongoing checkout flow.
     */
    PENDING_CHECKOUT_FLOW = 'pending_checkout_flow',
}

/**
 * Represents a purchasable item in the shop.
 * Extends the base InWorldPurchasable type with additional shop-specific properties.
 */
type ShopItemDescription = hz.InWorldPurchasable & {
    /**
     * Alternative price in soft currency (in-game currency).
     * Can be null if the item is only purchasable with hard currency.
     */
    softCurrencyPrice: ShopItemDescription | null,

    /**
     * Unique identifier for the item's thumbnail image asset.
     */
    thumbnailId: bigint,

    /**
     * Version identifier for the item's thumbnail image asset.
     */
    thumbnailVersionId: bigint,

    /**
     * Indicates whether the item has been validated by the system.
     * Items must be validated before they can be purchased.
     */
    validated: boolean
}

/**
 * Contains metadata information about a shop.
 * Used to display shop header information to players.
 */
type ShopMetadata = {
    /**
     * The display title of the shop.
     */
    title: string;

    /**
     * Unique identifier for the shop's title icon asset.
     */
    titleIconId: bigint,

    /**
     * Version identifier for the shop's title icon asset.
     */
    titleIconVersionId: bigint,
}

/**
 * Represents an item that a player is entitled to (has purchased or earned).
 * Used to track ownership of digital goods.
 */
type Entitlement = {
    /**
     * Stock Keeping Unit - unique identifier for the entitlement.
     */
    sku: string;

    /**
     * The number of this item that the player owns.
     */
    quantity: number;
}

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
    RequestShopList: new hz.NetworkEvent<{ player: hz.Player, id: string | null }>('ShopEvents.RequestShopList'),

    /**
     * Event triggered when a player requests their current entitlements.
     * The id parameter can be used to filter entitlements for a specific shop.
     */
    RequestEntitlements: new hz.NetworkEvent<{ player: hz.Player, id: string | null }>('ShopEvents.RequestEntitlements'),

    /**
     * Event triggered to broadcast shop information to all players.
     * Used for global shop updates or announcements.
     */
    BroadcastShopList: new hz.NetworkEvent<{ id: string | null, metadata: ShopMetadata, list: ShopItemDescription[], currencies: ShopItemDescription[] }>('ShopEvents.BroadcastShopList'),

    /**
     * Event triggered to send shop information to a specific player.
     * Response to a RequestShopList event.
     */
    SendShopList: new hz.NetworkEvent<{ player: hz.Player, id: string | null, metadata: ShopMetadata, list: ShopItemDescription[], currencies: ShopItemDescription[] }>('ShopEvents.SendShopList'),

    /**
     * Event triggered to send entitlement information to a specific player.
     * Response to a RequestEntitlements event.
     */
    SendEntitlements: new hz.NetworkEvent<{ player: hz.Player, id: string | null, list: Entitlement[] }>('ShopEvents.SendEntitlements'),

    /**
     * Event triggered when a player attempts to purchase an item.
     * Initiates the purchase flow.
     */
    Purchase: new hz.NetworkEvent<{ player: hz.Player, id: string | null, item: ShopItemDescription }>('ShopEvents.Purchase'),

    /**
     * Event triggered to inform a player about the result of their purchase attempt.
     * The result enum indicates whether the purchase was successful or why not.
     */
    Receipt: new hz.NetworkEvent<{ player: hz.Player, id: string | null, item: ShopItemDescription, result: PurchaseResult }>('ShopEvents.Receipt'),
}

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
    private owner: Component | undefined;
    /**
     * Collection of purchasable items available in the shop
     */
    private items: ShopItemDescription[] = [];

    /**
     * Collection of currencies that can be used for purchases
     */
    private currencies: ShopItemDescription[] = [];

    /**
     * List of SKUs (Stock Keeping Units) that the shop is interested in tracking
     * This includes both items and currencies
     */
    private skusOfInterest: string[] = [];

    /**
     * Returns all available items in the shop
     * @returns Array of shop items
     */
    public get Items(): ShopItemDescription[] { return this.items; }

    /**
     * Returns all available currencies in the shop
     * @returns Array of currencies
     */
    public get Currencies(): ShopItemDescription[] { return this.currencies; }

    /**
     * Constructor to initialize the ShopLogic with an owner component
     * @param owner The component that owns this shop logic, used to get the async context
     */
    constructor(owner: Component | undefined) {
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
    public async buy(player: hz.Player, item: ShopItemDescription): Promise<PurchaseResult> {
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
            const softCurrencyQuantity: number = Number(await hz.WorldInventory.getPlayerEntitlementQuantity(player, item.softCurrencyPrice.sku));
            const softCurrencyCost: number = item.softCurrencyPrice.quantity;
            const expectedNewCurrencyQuantity: number = softCurrencyQuantity - softCurrencyCost;

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
                    await new Promise(r => this.owner!.async.setTimeout(r, 1000));
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
    private async hasExpectedEntitlements(player: hz.Player, expectedItemSku: string, expectedItemQuantity: number) {
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
    public async getPlayerEntitlements(player: hz.Player): Promise<hz.PlayerEntitlement[]> {
        try {
            // Get all entitlements for the player
            const entitlements = await hz.WorldInventory.getPlayerEntitlements(player);

            // Only return entitlements for items that are part of this shop
            return entitlements.filter(entitlement => this.skusOfInterest.includes(entitlement.sku));
        } catch (error) {
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
    public async setupItems(serializedItems: ShopItemDescription[], serializedCurrencies: ShopItemDescription[]): Promise<void> {
        // Filter out items with valid SKUs
        const purchasableItems = serializedItems.filter(item => item.sku);

        // Extract SKUs of soft currencies used for purchases
        const softCurrencyItems = purchasableItems
            .filter(item => item.softCurrencyPrice?.sku)
            .map(item => item.softCurrencyPrice!.sku);

        // Extract SKUs of currencies defined in the shop
        const pickedCurrencyItems = serializedCurrencies.filter(currency => currency.sku).map(currency => currency.sku);

        // Combine all SKUs of interest for the shop
        this.skusOfInterest = purchasableItems.map(item => item.sku)
            .concat(softCurrencyItems)
            .concat(pickedCurrencyItems);

        // Fetch detailed information about all purchasable items
        let purchasables: hz.InWorldPurchasable[] = [];
        try {
            purchasables = await hz.WorldInventory.getWorldPurchasablesBySKUs(this.skusOfInterest);
        } catch (e) {
            console.error(`Error fetching items: ${e}`);
        }

        // Reset currencies before populating
        this.currencies = [];

        // Populate currencies with detailed information
        for (const serializedCurrency of serializedCurrencies) {
            const purchasable = purchasables.find(p => p.sku === serializedCurrency.sku);
            if (purchasable) {
                // Create currency object with combined information
                const currency: ShopItemDescription = {
                    ...purchasable!,
                    thumbnailId: serializedCurrency.thumbnailId,
                    thumbnailVersionId: serializedCurrency.thumbnailVersionId,
                    validated: true,
                    softCurrencyPrice: null // Currencies can't be purchased with other currencies
                }
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
                let softCurrencyPrice: ShopItemDescription | null = null;
                if (purchasableItem.softCurrencyPrice != null) {
                    // Find the currency in our currencies list
                    const currency = this.currencies.find(p => p.sku === purchasableItem.softCurrencyPrice!.sku);
                    if (currency) {
                        // Create soft currency price object
                        softCurrencyPrice = {
                            ...currency,
                            quantity: purchasableItem.softCurrencyPrice.quantity,
                        }
                    }
                    else {
                        console.error(`Could not find currency for item ${purchasableItem.sku}`);
                        continue; // Skip this item if currency not found
                    }
                }

                // Create item object with combined information
                const item: ShopItemDescription = {
                    ...purchasable!,
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
abstract class EconomyServer<T, TLogic> extends hz.Component<T> {

    /**
     * Constant identifier key used for economy server identification
     */
    static readonly ID = "Id";

    /**
     * Constant key for the displayed title in the UI
     */
    static readonly DISPLAYED_TITLE_KEY = "Displayed Title";

    /**
     * Constant key for the icon associated with the displayed title
     */
    static readonly DISPLAYED_TITLE_ICON = "Displayed Title Icon";

    /**
     * Abstract method that must be implemented by subclasses.
     * Called after the component has been fully initialized with its logic.
     */
    protected abstract onInitialized(): void;

    /**
     * The unique identifier for this economy server instance
     */
    protected id: string | null = null;

    /**
     * Icon asset associated with this economy server
     */
    protected icon: Readonly<hz.Asset> | undefined;

    /**
     * The business logic implementation for this economy server
     */
    private logic: TLogic | null = null;

    /**
     * Gets the unique identifier of this economy server
     * @returns The server's ID or null if not set
     */
    public get Id(): string | null { return this.id; }

    /**
     * Gets the business logic implementation
     * @returns The logic implementation or null if not initialized
     */
    public get Logic(): TLogic | null { return this.logic; }

    /**
     * Determines if this server is the intended recipient for a given ID
     * @param id The ID to check against this server
     * @returns True if this server should handle the request (when ID matches or input ID is null)
     */
    public isRecipient(id: string | null) {
        return (id === null || this.Id === id);
    }

    /**
     * Abstract method that must be implemented by subclasses.
     * Responsible for creating and initializing the business logic for this server.
     * @returns A promise that resolves to the initialized logic instance
     */
    protected abstract initializeLogic(): Promise<TLogic>;

    /**
     * Lifecycle method called before the component starts.
     * Handles initialization of resources and business logic.
     *
     * The initialization sequence:
     * 1. Preloads icon assets if available
     * 2. Initializes the business logic
     * 3. Calls the onInitialized hook for subclass-specific initialization
     */
    async preStart(): Promise<void> {
        // Preload the icon asset if one is defined
        if (this.icon) {
            ImageSource.fromTextureAsset(this.icon);
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

export class Shop extends EconomyServer<typeof Shop, ShopLogic> {
    /**
     * Constants for Item 1 configuration
     * SKU: Unique identifier for the item
     * THUMBNAIL: Asset reference for item's image
     * COST_SKU: Currency SKU used to purchase this item
     * COST_QUANTITY: Amount of currency needed to purchase
     */
    static readonly ITEM_1_SKU = "Item 1 SKU";
    static readonly ITEM_1_THUMBNAIL = "Item 1 Thumbnail";
    static readonly ITEM_1_COST_SKU = "Item 1 Cost SKU";
    static readonly ITEM_1_COST_QUANTITY = "Item 1 Cost Quantity";

    /**
     * Constants for Item 2 configuration
     */
    static readonly ITEM_2_SKU = "Item 2 SKU";
    static readonly ITEM_2_THUMBNAIL = "Item 2 Thumbnail";
    static readonly ITEM_2_COST_SKU = "Item 2 Cost SKU";
    static readonly ITEM_2_COST_QUANTITY = "Item 2 Cost Quantity";

    /**
     * Constants for Item 3 configuration
     */
    static readonly ITEM_3_SKU = "Item 3 SKU";
    static readonly ITEM_3_THUMBNAIL = "Item 3 Thumbnail";
    static readonly ITEM_3_COST_SKU = "Item 3 Cost SKU";
    static readonly ITEM_3_COST_QUANTITY = "Item 3 Cost Quantity";

    /**
     * Constants for Item 4 configuration
     */
    static readonly ITEM_4_SKU = "Item 4 SKU";
    static readonly ITEM_4_THUMBNAIL = "Item 4 Thumbnail";
    static readonly ITEM_4_COST_SKU = "Item 4 Cost SKU";
    static readonly ITEM_4_COST_QUANTITY = "Item 4 Cost Quantity";

    /**
     * Constants for Item 5 configuration
     */
    static readonly ITEM_5_SKU = "Item 5 SKU";
    static readonly ITEM_5_THUMBNAIL = "Item 5 Thumbnail";
    static readonly ITEM_5_COST_SKU = "Item 5 Cost SKU";
    static readonly ITEM_5_COST_QUANTITY = "Item 5 Cost Quantity";

    /**
     * Constants for Item 6 configuration
     */
    static readonly ITEM_6_SKU = "Item 6 SKU";
    static readonly ITEM_6_THUMBNAIL = "Item 6 Thumbnail";
    static readonly ITEM_6_COST_SKU = "Item 6 Cost SKU";
    static readonly ITEM_6_COST_QUANTITY = "Item 6 Cost Quantity";

    /**
     * Constants for Item 7 configuration
     */
    static readonly ITEM_7_SKU = "Item 7 SKU";
    static readonly ITEM_7_THUMBNAIL = "Item 7 Thumbnail";
    static readonly ITEM_7_COST_SKU = "Item 7 Cost SKU";
    static readonly ITEM_7_COST_QUANTITY = "Item 7 Cost Quantity";

    /**
     * Constants for Item 8 configuration
     */
    static readonly ITEM_8_SKU = "Item 8 SKU";
    static readonly ITEM_8_THUMBNAIL = "Item 8 Thumbnail";
    static readonly ITEM_8_COST_SKU = "Item 8 Cost SKU";
    static readonly ITEM_8_COST_QUANTITY = "Item 8 Cost Quantity";

    // To add additional items, add additional constants here
    // and add them to the Shop component's property definitions
    // and the Shop component's initializeLogic() method

    /**
     * Constants for Currency 1 configuration
     * This currency can be used to purchase items in the shop
     */
    static readonly CURRENCY_SKU = "Soft Currency SKU";
    static readonly CURRENCY_THUMBNAIL = "Soft Currency Thumbnail";

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
    static propsDefinition = {
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
    }

    /**
     * Converts item data into a standardized ShopItemDescription object
     *
     * @param sku - Unique identifier for the item
     * @param thumbnail - Image asset for the item
     * @param cost_sku - Currency SKU required to purchase this item (optional)
     * @param cost_quantity - Amount of currency required to purchase this item (optional)
     * @returns A ShopItemDescription object representing the item
     */
    private toShopItemDescription({ sku, thumbnail, cost_sku, cost_quantity }: { sku: string, thumbnail: TextureAsset | undefined, cost_sku?: string, cost_quantity?: number }): ShopItemDescription {
        // Create soft currency price object if the item has a cost
        const softCurrencyPrice: ShopItemDescription | null =
            (cost_quantity ?? 0) > 0 ? {
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
    async initializeLogic(): Promise<ShopLogic> {
        // Set shop icon and ID from properties
        this.icon = this.props[EconomyServer.DISPLAYED_TITLE_ICON];
        this.id = this.props[EconomyServer.ID];

        // Build array of items to show in the shop from configured properties
        const items = [
            { sku: this.props[Shop.ITEM_1_SKU], thumbnail: this.props[Shop.ITEM_1_THUMBNAIL] as TextureAsset, cost_sku: this.props[Shop.ITEM_1_COST_SKU], cost_quantity: this.props[Shop.ITEM_1_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_2_SKU], thumbnail: this.props[Shop.ITEM_2_THUMBNAIL] as TextureAsset, cost_sku: this.props[Shop.ITEM_2_COST_SKU], cost_quantity: this.props[Shop.ITEM_2_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_3_SKU], thumbnail: this.props[Shop.ITEM_3_THUMBNAIL] as TextureAsset, cost_sku: this.props[Shop.ITEM_3_COST_SKU], cost_quantity: this.props[Shop.ITEM_3_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_4_SKU], thumbnail: this.props[Shop.ITEM_4_THUMBNAIL] as TextureAsset, cost_sku: this.props[Shop.ITEM_4_COST_SKU], cost_quantity: this.props[Shop.ITEM_4_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_5_SKU], thumbnail: this.props[Shop.ITEM_5_THUMBNAIL] as TextureAsset, cost_sku: this.props[Shop.ITEM_5_COST_SKU], cost_quantity: this.props[Shop.ITEM_5_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_6_SKU], thumbnail: this.props[Shop.ITEM_6_THUMBNAIL] as TextureAsset, cost_sku: this.props[Shop.ITEM_6_COST_SKU], cost_quantity: this.props[Shop.ITEM_6_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_7_SKU], thumbnail: this.props[Shop.ITEM_7_THUMBNAIL] as TextureAsset, cost_sku: this.props[Shop.ITEM_7_COST_SKU], cost_quantity: this.props[Shop.ITEM_7_COST_QUANTITY] },
            { sku: this.props[Shop.ITEM_8_SKU], thumbnail: this.props[Shop.ITEM_8_THUMBNAIL] as TextureAsset, cost_sku: this.props[Shop.ITEM_8_COST_SKU], cost_quantity: this.props[Shop.ITEM_8_COST_QUANTITY] },
        ];

        // Build array of currencies available in the shop
        const currencies = [
            { sku: this.props[Shop.CURRENCY_SKU], thumbnail: this.props[Shop.CURRENCY_THUMBNAIL] as TextureAsset }
        ];

        // Preload all item thumbnails to the server for client access
        for (const item of items) {
            if (item.thumbnail) {
                ImageSource.fromTextureAsset(item.thumbnail);
            }
        };

        // Preload all currency thumbnails to the server for client access
        for (const currency of currencies) {
            if (currency.thumbnail) {
                ImageSource.fromTextureAsset(currency.thumbnail);
            }
        };

        // Preload shop icon if available
        if (this.icon) {
            ImageSource.fromTextureAsset(this.icon);
        }

        // Initialize shop logic with items and currencies
        const logic = new ShopLogic(this);
        await logic.setupItems(
            items.map(item => this.toShopItemDescription(item)),
            currencies.map(currency => this.toShopItemDescription(currency))
        );
        return logic;
    }

    /**
     * Called when the component is initialized
     * Sets up network event handlers and broadcasts initial shop list
     */
    protected onInitialized() {
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
    private broadcastShopList() {
        this.sendNetworkBroadcastEvent(ShopEvents.BroadcastShopList,
            {
                id: this.props[Shop.ID],
                metadata: {
                    title: this.props[Shop.DISPLAYED_TITLE_KEY],
                    titleIconId: this.icon?.id ?? BigInt(0),
                    titleIconVersionId: this.icon?.versionId ?? BigInt(0)
                },
                list: this.Logic!.Items,       // Get available items from shop logic
                currencies: this.Logic!.Currencies // Get available currencies from shop logic
            });
    }

    /**
     * Handles client requests for shop list data
     * Sends shop information to the requesting player
     *
     * @param player - The player requesting the shop list
     * @param id - Shop ID to identify which shop is being requested
     */
    private OnShopListRequested({ player, id }: { player: hz.Player, id: string | null }) {
        if (!this.isRecipient(id)) {
            // Reject this request as it is not aimed at this shop
            return;
        }

        // Send shop information directly to the requesting player
        this.sendNetworkBroadcastEvent(ShopEvents.SendShopList,
            {
                player: player, // Target specific player
                id: this.props[Shop.ID],
                metadata: {
                    title: this.props[Shop.DISPLAYED_TITLE_KEY],
                    titleIconId: this.icon?.id ?? BigInt(0),
                    titleIconVersionId: this.icon?.versionId ?? BigInt(0)
                },
                list: this.Logic!.Items,
                currencies: this.Logic!.Currencies
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
    private async OnPurchase({ player, id, item }: { player: hz.Player, id: string | null, item: ShopItemDescription }) {
        if (!this.isRecipient(id)) {
            // Reject this request as it is not aimed at this shop
            return;
        }

        // Process purchase through shop logic
        const result = await this.Logic!.buy(player, item);

        // Send purchase receipt to the player
        this.sendNetworkBroadcastEvent(ShopEvents.Receipt,
            {
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
    private async OnEntitlementsRequested({ player, id }: { player: hz.Player, id: string | null }) {
        if (!this.isRecipient(id)) {
            // Reject this request as it is not aimed at this shop
            return;
        }

        // Get player's entitlements (owned items) from shop logic
        const entitlements = await this.Logic!.getPlayerEntitlements(player);

        // Send entitlements to the requesting player
        this.sendNetworkBroadcastEvent(ShopEvents.SendEntitlements,
            {
                player: player,
                id: this.props[Shop.ID],
                list: entitlements // List of items the player owns
            });
    }
}

/**
 * Register the Shop component with the Horizon framework
 */
hz.Component.register(Shop);
