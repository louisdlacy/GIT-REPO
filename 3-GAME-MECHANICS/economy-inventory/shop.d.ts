/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
import * as hz from 'horizon/core';
import { Component } from 'horizon/core';
/**
 * Enum representing the possible results of a purchase transaction
 */
declare enum PurchaseResult {
    /**
     * Indicates that the purchase was successful.
     */
    SUCCESS = "success",
    /**
     * Indicates that the purchase failed due to insufficient funds.
     * This can only happen if the player is trying to purchase with soft currency.
     */
    INSUFFICIENT_FUNDS = "insufficient_funds",
    /**
     * Indicates that the purchase failed because the item is invalid.
     */
    INVALID_ITEM = "invalid_item",
    /**
     * Indicates that the purchase failed because the cost is invalid.
     */
    INVALID_COST = "invalid_cost",
    /**
     * Indicates that the purchase attempt timed out.
     * Which is not a guarantee of either success or failure.
     * It is recommended to fetch entitlements to confirm the purchase status.
     */
    TIMED_OUT = "timed_out",
    /**
     * Indicates that the purchase is pending due to an ongoing checkout flow.
     */
    PENDING_CHECKOUT_FLOW = "pending_checkout_flow"
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
    softCurrencyPrice: ShopItemDescription | null;
    /**
     * Unique identifier for the item's thumbnail image asset.
     */
    thumbnailId: bigint;
    /**
     * Version identifier for the item's thumbnail image asset.
     */
    thumbnailVersionId: bigint;
    /**
     * Indicates whether the item has been validated by the system.
     * Items must be validated before they can be purchased.
     */
    validated: boolean;
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
declare class ShopLogic {
    private owner;
    /**
     * Collection of purchasable items available in the shop
     */
    private items;
    /**
     * Collection of currencies that can be used for purchases
     */
    private currencies;
    /**
     * List of SKUs (Stock Keeping Units) that the shop is interested in tracking
     * This includes both items and currencies
     */
    private skusOfInterest;
    /**
     * Returns all available items in the shop
     * @returns Array of shop items
     */
    get Items(): ShopItemDescription[];
    /**
     * Returns all available currencies in the shop
     * @returns Array of currencies
     */
    get Currencies(): ShopItemDescription[];
    /**
     * Constructor to initialize the ShopLogic with an owner component
     * @param owner The component that owns this shop logic, used to get the async context
     */
    constructor(owner: Component | undefined);
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
    buy(player: hz.Player, item: ShopItemDescription): Promise<PurchaseResult>;
    /**
     * Checks asynchronously if a player has the expected entitlements for a given item
     * @param player The player to check
     * @param expectedItemSku The SKU of the item to check
     * @param expectedItemQuantity The expected quantity of the item
     * @returns Whether the player has the expected entitlements
     */
    private hasExpectedEntitlements;
    /**
     * Retrieves all items owned by a player that are relevant to this shop
     *
     * @param player The player whose entitlements to fetch
     * @returns Promise resolving to an array of player entitlements
     */
    getPlayerEntitlements(player: hz.Player): Promise<hz.PlayerEntitlement[]>;
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
    setupItems(serializedItems: ShopItemDescription[], serializedCurrencies: ShopItemDescription[]): Promise<void>;
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
declare abstract class EconomyServer<T, TLogic> extends hz.Component<T> {
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
    protected id: string | null;
    /**
     * Icon asset associated with this economy server
     */
    protected icon: Readonly<hz.Asset> | undefined;
    /**
     * The business logic implementation for this economy server
     */
    private logic;
    /**
     * Gets the unique identifier of this economy server
     * @returns The server's ID or null if not set
     */
    get Id(): string | null;
    /**
     * Gets the business logic implementation
     * @returns The logic implementation or null if not initialized
     */
    get Logic(): TLogic | null;
    /**
     * Determines if this server is the intended recipient for a given ID
     * @param id The ID to check against this server
     * @returns True if this server should handle the request (when ID matches or input ID is null)
     */
    isRecipient(id: string | null): boolean;
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
    preStart(): Promise<void>;
    /**
     * Lifecycle method called when the component starts.
     * Currently empty as all initialization is handled in preStart.
     *
     * Implementation of this method is required by the hz.Component base class.
     * @remarks Note that this method will be called before preStart() is over due
     * to the fact that preStart() is exceptionally asynchronous.
     */
    start(): void;
}
export declare class Shop extends EconomyServer<typeof Shop, ShopLogic> {
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
    /**
     * Constants for Currency 1 configuration
     * This currency can be used to purchase items in the shop
     */
    static readonly CURRENCY_SKU = "Soft Currency SKU";
    static readonly CURRENCY_THUMBNAIL = "Soft Currency Thumbnail";
    /**
     * Property definitions for the Shop component
     * These properties can be configured in the editor and will be used at runtime
     *
     * Properties include:
     * - Shop identification and display properties (ID, title, icon)
     * - Item configurations (SKU, thumbnail, cost currency, cost amount)
     * - Currency configurations (SKU, thumbnail)
     */
    static propsDefinition: {
        Id: {
            type: "string";
        };
        "Displayed Title": {
            type: "string";
        };
        "Displayed Title Icon": {
            type: "Asset";
        };
        "Soft Currency SKU": {
            type: "string";
        };
        "Soft Currency Thumbnail": {
            type: "Asset";
        };
        "Item 1 SKU": {
            type: "string";
        };
        "Item 1 Thumbnail": {
            type: "Asset";
        };
        "Item 1 Cost SKU": {
            type: "string";
        };
        "Item 1 Cost Quantity": {
            type: "number";
        };
        "Item 2 SKU": {
            type: "string";
        };
        "Item 2 Thumbnail": {
            type: "Asset";
        };
        "Item 2 Cost SKU": {
            type: "string";
        };
        "Item 2 Cost Quantity": {
            type: "number";
        };
        "Item 3 SKU": {
            type: "string";
        };
        "Item 3 Thumbnail": {
            type: "Asset";
        };
        "Item 3 Cost SKU": {
            type: "string";
        };
        "Item 3 Cost Quantity": {
            type: "number";
        };
        "Item 4 SKU": {
            type: "string";
        };
        "Item 4 Thumbnail": {
            type: "Asset";
        };
        "Item 4 Cost SKU": {
            type: "string";
        };
        "Item 4 Cost Quantity": {
            type: "number";
        };
        "Item 5 SKU": {
            type: "string";
        };
        "Item 5 Thumbnail": {
            type: "Asset";
        };
        "Item 5 Cost SKU": {
            type: "string";
        };
        "Item 5 Cost Quantity": {
            type: "number";
        };
        "Item 6 SKU": {
            type: "string";
        };
        "Item 6 Thumbnail": {
            type: "Asset";
        };
        "Item 6 Cost SKU": {
            type: "string";
        };
        "Item 6 Cost Quantity": {
            type: "number";
        };
        "Item 7 SKU": {
            type: "string";
        };
        "Item 7 Thumbnail": {
            type: "Asset";
        };
        "Item 7 Cost SKU": {
            type: "string";
        };
        "Item 7 Cost Quantity": {
            type: "number";
        };
        "Item 8 SKU": {
            type: "string";
        };
        "Item 8 Thumbnail": {
            type: "Asset";
        };
        "Item 8 Cost SKU": {
            type: "string";
        };
        "Item 8 Cost Quantity": {
            type: "number";
        };
    };
    /**
     * Converts item data into a standardized ShopItemDescription object
     *
     * @param sku - Unique identifier for the item
     * @param thumbnail - Image asset for the item
     * @param cost_sku - Currency SKU required to purchase this item (optional)
     * @param cost_quantity - Amount of currency required to purchase this item (optional)
     * @returns A ShopItemDescription object representing the item
     */
    private toShopItemDescription;
    /**
     * Initializes the shop logic with configured items and currencies
     * This method is called during component initialization
     *
     * @returns Promise resolving to the initialized ShopLogic instance
     */
    initializeLogic(): Promise<ShopLogic>;
    /**
     * Called when the component is initialized
     * Sets up network event handlers and broadcasts initial shop list
     */
    protected onInitialized(): void;
    /**
     * Broadcasts the shop list to all connected clients
     * Contains shop metadata, available items, and currencies
     */
    private broadcastShopList;
    /**
     * Handles client requests for shop list data
     * Sends shop information to the requesting player
     *
     * @param player - The player requesting the shop list
     * @param id - Shop ID to identify which shop is being requested
     */
    private OnShopListRequested;
    /**
     * Handles purchase requests from clients
     * Processes the purchase through shop logic and sends receipt
     *
     * @param player - The player making the purchase
     * @param id - Shop ID to identify which shop is handling the purchase
     * @param item - The item being purchased
     */
    private OnPurchase;
    /**
     * Handles requests for player entitlements
     * Retrieves and sends the player's owned items
     *
     * @param player - The player requesting entitlements
     * @param id - Shop ID to identify which shop is handling the request
     */
    private OnEntitlementsRequested;
}
export {};
