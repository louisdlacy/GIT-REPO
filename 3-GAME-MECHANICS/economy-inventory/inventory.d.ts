/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
import * as hz from 'horizon/core';
import { Component } from 'horizon/core';
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
/**
 * Represents an item in the inventory.
 */
type ItemDescription = {
    /** Unique sku of the item */
    sku: string;
    /** Name of the item */
    name: string;
    /** Description of the item */
    description: string;
    /** Unique identifier for the item's thumbnail image asset. */
    thumbnailId: bigint;
    /** Version identifier for the item's thumbnail image asset. */
    thumbnailVersionId: bigint;
    /** Indicates whether the item has been validated by the system. */
    validated: boolean;
};
/**
 * Class to display and manage the inventory of the player
 */
declare class InventoryLogic {
    private owner;
    /**
     * Collection of purchasable items available in the inventory
     */
    private items;
    /**
     * List of SKUs (Stock Keeping Units) that the inventory is interested in tracking
     * This includes both items and currencies
     */
    private skusOfInterest;
    /**
     * Returns all available items in the inventory
     * @returns Array of items
     */
    get Items(): ItemDescription[];
    /**
     * Constructor to initialize the ShopLogic with an owner component
     * @param owner The component that owns this logic, used to get the async context
     */
    constructor(owner: Component | undefined);
    /**
     * Get the inventory of a player
     * @param player - The player to get the inventory for
     * @returns A promise that resolves to an array of PlayerEntitlement objects
     */
    getPlayerEntitlements(player: hz.Player): Promise<hz.PlayerEntitlement[]>;
    /**
     * Initializes the inventory with items and currencies
     *
     * This method:
     * 1. Collects all SKUs of interest from items
     * 2. Fetches detailed information about purchasable items from the backend
     * 3. Sets up the items available in the inventory
     *
     * @param serializedItems Array of item descriptions from configuration
     * @param serializedCurrencies Array of currency descriptions from configuration
     * @returns Promise that resolves when setup is complete
     */
    setupItems(serializedItems: ItemDescription[]): Promise<void>;
}
export declare class Inventory extends EconomyServer<typeof Inventory, InventoryLogic> {
    /**
     * Constants for Item 1 configuration
     * SKU: Unique identifier for the item
     * THUMBNAIL: Asset reference for item's image
     */
    static readonly ITEM_1_SKU = "Item 1 SKU";
    static readonly ITEM_1_THUMBNAIL = "Item 1 Thumbnail";
    /**
     * Constants for Item 2 configuration
     */
    static readonly ITEM_2_SKU = "Item 2 SKU";
    static readonly ITEM_2_THUMBNAIL = "Item 2 Thumbnail";
    /**
     * Constants for Item 3 configuration
     */
    static readonly ITEM_3_SKU = "Item 3 SKU";
    static readonly ITEM_3_THUMBNAIL = "Item 3 Thumbnail";
    /**
     * Constants for Item 4 configuration
     */
    static readonly ITEM_4_SKU = "Item 4 SKU";
    static readonly ITEM_4_THUMBNAIL = "Item 4 Thumbnail";
    /**
     * Constants for Item 5 configuration
     */
    static readonly ITEM_5_SKU = "Item 5 SKU";
    static readonly ITEM_5_THUMBNAIL = "Item 5 Thumbnail";
    /**
     * Constants for Item 6 configuration
     */
    static readonly ITEM_6_SKU = "Item 6 SKU";
    static readonly ITEM_6_THUMBNAIL = "Item 6 Thumbnail";
    /**
     * Constants for Item 7 configuration
     */
    static readonly ITEM_7_SKU = "Item 7 SKU";
    static readonly ITEM_7_THUMBNAIL = "Item 7 Thumbnail";
    /**
     * Constants for Item 8 configuration
     */
    static readonly ITEM_8_SKU = "Item 8 SKU";
    static readonly ITEM_8_THUMBNAIL = "Item 8 Thumbnail";
    /**
     * Property definitions for the Inventory component
     * These properties can be configured in the editor and will be used at runtime
     *
     * Properties include:
     * - Inventory identification and display properties (ID, title, icon)
     * - Item configurations (SKU, thumbnail, cost currency, cost amount)
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
        "Item 1 SKU": {
            type: "string";
        };
        "Item 1 Thumbnail": {
            type: "Asset";
        };
        "Item 2 SKU": {
            type: "string";
        };
        "Item 2 Thumbnail": {
            type: "Asset";
        };
        "Item 3 SKU": {
            type: "string";
        };
        "Item 3 Thumbnail": {
            type: "Asset";
        };
        "Item 4 SKU": {
            type: "string";
        };
        "Item 4 Thumbnail": {
            type: "Asset";
        };
        "Item 5 SKU": {
            type: "string";
        };
        "Item 5 Thumbnail": {
            type: "Asset";
        };
        "Item 6 SKU": {
            type: "string";
        };
        "Item 6 Thumbnail": {
            type: "Asset";
        };
        "Item 7 SKU": {
            type: "string";
        };
        "Item 7 Thumbnail": {
            type: "Asset";
        };
        "Item 8 SKU": {
            type: "string";
        };
        "Item 8 Thumbnail": {
            type: "Asset";
        };
    };
    /**
     * Converts item data into a standardized ItemDescription object
     *
     * @param sku - Unique identifier for the item
     * @param thumbnail - Image asset for the item
     * @returns A ItemDescription object representing the item
     */
    private toItemDescription;
    /**
     * Initializes the logic with configured items
     * This method is called during component initialization
     *
     * @returns Promise resolving to the initialized ShopLogic instance
     */
    initializeLogic(): Promise<InventoryLogic>;
    /**
     * Called when the component is initialized
     * Sets up network event handlers and broadcasts initial list
     */
    protected onInitialized(): void;
    /**
     * Broadcasts the list to all connected clients
     * Contains metadata and items of interests
     */
    private broadcastItems;
    /**
     * Handles client requests for list data
     * Sends information to the requesting player
     *
     * @param player - The player requesting the list
     * @param id - Shop ID to identify which inventory is being requested
     */
    private OnItemsRequested;
    /**
     * Handles the request to use an item
     * This implementation is given as an example and we recommend
     * having your own gameplay scripts listening to the InventoryEvents.UseItem
     * event and handle the use/consumption of an item.
     *
     * @remarks The UI expects an acknowledgement via the usage of the
     * InventoryEvents.AcknowledgeUseItem.
     *
     * @param player - The player requesting entitlements
     * @param id - Inventory ID to identify which inventory is handling the request
     * @param item - The item being used
     */
    private OnItemUsed;
    /**
     * Handles requests for player entitlements
     * Retrieves and sends the player's owned items
     *
     * @param player - The player requesting entitlements
     * @param id - Inventory ID to identify which inventory is handling the request
     */
    private OnEntitlementsRequested;
}
export {};
