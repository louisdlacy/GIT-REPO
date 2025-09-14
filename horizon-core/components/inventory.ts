/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

// @generated version: 2FKDKA

import * as hz from 'horizon/core';
import { TextureAsset, Component } from 'horizon/core';
import { ImageSource } from 'horizon/ui';

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
  thumbnailId: bigint,

  /** Version identifier for the item's thumbnail image asset. */
  thumbnailVersionId: bigint,

  /** Indicates whether the item has been validated by the system. */
  validated: boolean
}

/**
 * Contains metadata information about the inventory.
 * Used to display inventory header information to players.
 */
type Metadata = {
  /** The display title of the inventory. */
  title: string;

  /** Unique identifier for the inventory's title icon asset. */
  titleIconId: bigint,

  /** Version identifier for the inventory's title icon asset. */
  titleIconVersionId: bigint,
}

/**
 * Represents an item that a player is entitled to (has purchased or earned).
 * Used to track ownership of digital goods.
 */
type Entitlement = {
  /** Unique identifier of the item for this entitlement. */
  sku: string;

  /** The number of this item that the player owns. */
  quantity: number;
}

/**
 * Collection of network events used for inventory related communication.
 * These events facilitate the flow of data between client and server
 * for listing and entitlement management.
 */
const InventoryEvents = {
  /**
   * Event triggered when a player requests the list of items in the inventory.
   * The id parameter can be used to request a specific inventory if multiples exist.
   */
  RequestItems: new hz.NetworkEvent<{ player: hz.Player, id: string | null }>('InventoryEvents.RequestItems'),

  /**
   * Event triggered when a player requests their current entitlements.
   * The id parameter can be used to filter entitlements for a specific inventory.
   */
  RequestEntitlements: new hz.NetworkEvent<{ player: hz.Player, id: string | null }>('InventoryEvents.RequestEntitlements'),

  /**
   * Event triggered to broadcast shop information to all players.
   * Used for global shop updates or announcements.
   */
  BroadcastItems: new hz.NetworkEvent<{ id: string | null, metadata: Metadata, items: ItemDescription[] }>('InventoryEvents.BroadcastItems'),

  /**
   * Event triggered to send inventory information to a specific player.
   * Response to a RequestItems event.
   */
  SendItems: new hz.NetworkEvent<{ player: hz.Player, id: string | null, metadata: Metadata, items: ItemDescription[] }>('InventoryEvents.SendItems'),

  /**
   * Event triggered to send entitlement information to a specific player.
   * Response to a RequestEntitlements event.
   */
  SendEntitlements: new hz.NetworkEvent<{ player: hz.Player, id: string | null, entitlements: Entitlement[] }>('InventoryEvents.SendEntitlements'),

  /**
   * Event triggered to broadcast usage of an item.
   * We do not assume that this necessarily consumes the item
   * This event is meant to be caught by gameplay scripts, and acknowledged back
   */
  UseItem: new hz.NetworkEvent<{ player: hz.Player, id: string | null, item: ItemDescription }>('InventoryEvents.UseItem'),

  /**
   * Event to be triggered to confirm usage of an item.
   * This event is to be sent by some gameplay scripts to confirm to the inventory
   * that the item has indeed been used
   */
  AcknowledgeUseItem: new hz.NetworkEvent<{ player: hz.Player, id: string | null, item: ItemDescription }>('InventoryEvents.AcknowledgeUseItem'),
}

/**
 * Class to display and manage the inventory of the player
 */
class InventoryLogic {
  private owner: Component | undefined;
  /**
   * Collection of purchasable items available in the inventory
   */
  private items: ItemDescription[] = [];

  /**
   * List of SKUs (Stock Keeping Units) that the inventory is interested in tracking
   * This includes both items and currencies
   */
  private skusOfInterest: Set<string> | null = null;

  /**
   * Returns all available items in the inventory
   * @returns Array of items
   */
  public get Items(): ItemDescription[] { return this.items; }

  /**
   * Constructor to initialize the ShopLogic with an owner component
   * @param owner The component that owns this logic, used to get the async context
   */
  constructor(owner: Component | undefined) {
    this.owner = owner;
  }

  /**
   * Get the inventory of a player
   * @param player - The player to get the inventory for
   * @returns A promise that resolves to an array of PlayerEntitlement objects
   */
  public async getPlayerEntitlements(player: hz.Player): Promise<hz.PlayerEntitlement[]> {
    try {
      const entitlements = await hz.WorldInventory.getPlayerEntitlements(player);

      if (!this.skusOfInterest) {
        return entitlements;
      }

      return entitlements.filter(entitlement => this.skusOfInterest!.has(entitlement.sku));
    } catch (error) {
      throw error;
    }
  }

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
  public async setupItems(serializedItems: ItemDescription[]): Promise<void> {
    // Filter out items with valid SKUs
    const purchasableItems = serializedItems.filter(item => item.sku);

    // Combine all SKUs of interest for the inventory
    const skusOfInterest = purchasableItems.map(item => item.sku);
    this.skusOfInterest = new Set(skusOfInterest);

    // Fetch detailed information about all purchasable items
    let purchasables: hz.InWorldPurchasable[] = [];
    try {
      purchasables = await hz.WorldInventory.getWorldPurchasablesBySKUs(skusOfInterest);
    } catch (e) {
      console.error(`Error fetching items: ${e}`);
    }

    // Reset items before populating
    this.items = [];

    // Populate items with detailed information
    for (const purchasableItem of purchasableItems) {
      const purchasable = purchasables.find(p => p.sku === purchasableItem.sku);
      if (purchasable) {
        // Create item object with combined information
        const item: ItemDescription = {
          ...purchasable!,
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

export class Inventory extends EconomyServer<typeof Inventory, InventoryLogic> {
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

  // To add additional items, add additional constants here
  // and add them to the Inventory component's property definitions
  // and the Inventory component's initializeLogic() method

  /**
   * Property definitions for the Inventory component
   * These properties can be configured in the editor and will be used at runtime
   *
   * Properties include:
   * - Inventory identification and display properties (ID, title, icon)
   * - Item configurations (SKU, thumbnail, cost currency, cost amount)
   */
  static propsDefinition = {
    // Inventory identification and display properties
    [EconomyServer.ID]: { type: hz.PropTypes.String },
    [EconomyServer.DISPLAYED_TITLE_KEY]: { type: hz.PropTypes.String },
    [EconomyServer.DISPLAYED_TITLE_ICON]: { type: hz.PropTypes.Asset },

    // Item 1 configuration
    [Inventory.ITEM_1_SKU]: { type: hz.PropTypes.String },
    [Inventory.ITEM_1_THUMBNAIL]: { type: hz.PropTypes.Asset },

    // Item 2 configuration
    [Inventory.ITEM_2_SKU]: { type: hz.PropTypes.String },
    [Inventory.ITEM_2_THUMBNAIL]: { type: hz.PropTypes.Asset },

    // Item 3 configuration
    [Inventory.ITEM_3_SKU]: { type: hz.PropTypes.String },
    [Inventory.ITEM_3_THUMBNAIL]: { type: hz.PropTypes.Asset },

    // Item 4 configuration
    [Inventory.ITEM_4_SKU]: { type: hz.PropTypes.String },
    [Inventory.ITEM_4_THUMBNAIL]: { type: hz.PropTypes.Asset },

    // Item 5 configuration
    [Inventory.ITEM_5_SKU]: { type: hz.PropTypes.String },
    [Inventory.ITEM_5_THUMBNAIL]: { type: hz.PropTypes.Asset },

    // Item 6 configuration
    [Inventory.ITEM_6_SKU]: { type: hz.PropTypes.String },
    [Inventory.ITEM_6_THUMBNAIL]: { type: hz.PropTypes.Asset },

    // Item 7 configuration
    [Inventory.ITEM_7_SKU]: { type: hz.PropTypes.String },
    [Inventory.ITEM_7_THUMBNAIL]: { type: hz.PropTypes.Asset },

    // Item 8 configuration
    [Inventory.ITEM_8_SKU]: { type: hz.PropTypes.String },
    [Inventory.ITEM_8_THUMBNAIL]: { type: hz.PropTypes.Asset },
  }

  /**
   * Converts item data into a standardized ItemDescription object
   *
   * @param sku - Unique identifier for the item
   * @param thumbnail - Image asset for the item
   * @returns A ItemDescription object representing the item
   */
  private toItemDescription({ sku, thumbnail }: { sku: string, thumbnail: TextureAsset | undefined }): ItemDescription {
    // Return the complete item description
    return {
      sku: sku,
      name: '',
      description: '',
      thumbnailId: thumbnail?.id ?? BigInt(0), // Use thumbnail ID if available
      thumbnailVersionId: thumbnail?.versionId ?? BigInt(0), // Use thumbnail version ID if available
      validated: false
    };
  }

  /**
   * Initializes the logic with configured items
   * This method is called during component initialization
   *
   * @returns Promise resolving to the initialized ShopLogic instance
   */
  async initializeLogic(): Promise<InventoryLogic> {
    // Set icon and ID from properties
    this.icon = this.props[EconomyServer.DISPLAYED_TITLE_ICON];
    this.id = this.props[EconomyServer.ID];

    // Build array of items to show in the from configured properties
    const items = [
      { sku: this.props[Inventory.ITEM_1_SKU], thumbnail: this.props[Inventory.ITEM_1_THUMBNAIL] as TextureAsset },
      { sku: this.props[Inventory.ITEM_2_SKU], thumbnail: this.props[Inventory.ITEM_2_THUMBNAIL] as TextureAsset },
      { sku: this.props[Inventory.ITEM_3_SKU], thumbnail: this.props[Inventory.ITEM_3_THUMBNAIL] as TextureAsset },
      { sku: this.props[Inventory.ITEM_4_SKU], thumbnail: this.props[Inventory.ITEM_4_THUMBNAIL] as TextureAsset },
      { sku: this.props[Inventory.ITEM_5_SKU], thumbnail: this.props[Inventory.ITEM_5_THUMBNAIL] as TextureAsset },
      { sku: this.props[Inventory.ITEM_6_SKU], thumbnail: this.props[Inventory.ITEM_6_THUMBNAIL] as TextureAsset },
      { sku: this.props[Inventory.ITEM_7_SKU], thumbnail: this.props[Inventory.ITEM_7_THUMBNAIL] as TextureAsset },
      { sku: this.props[Inventory.ITEM_8_SKU], thumbnail: this.props[Inventory.ITEM_8_THUMBNAIL] as TextureAsset },
    ];

    // Preload all item thumbnails to the server for client access
    for (const item of items) {
      if (item.thumbnail) {
        ImageSource.fromTextureAsset(item.thumbnail);
      }
    };

    // Preload icon if available
    if (this.icon) {
      ImageSource.fromTextureAsset(this.icon);
    }

    // Initialize the logic with items
    const logic = new InventoryLogic(this);
    await logic.setupItems(
      items.map(item => this.toItemDescription(item))
    );

    return logic;
  }

  /**
   * Called when the component is initialized
   * Sets up network event handlers and broadcasts initial list
   */
  protected onInitialized() {
    // Connect network event handlers for inventory interactions
    this.connectNetworkBroadcastEvent(InventoryEvents.RequestItems, this.OnItemsRequested.bind(this));
    this.connectNetworkBroadcastEvent(InventoryEvents.RequestEntitlements, this.OnEntitlementsRequested.bind(this));

    // As an example, we are listening to the UseItem broadcast event here
    // But we recommend having your own gameplay scripts listening to it and
    // acknowleding back using the InventoryEvents.AcknowledgeUseItem event.
    // This the method OnItemUsed as a reference.
    this.connectNetworkBroadcastEvent(InventoryEvents.UseItem, this.OnItemUsed.bind(this));

    // Broadcast initial list to all clients
    this.broadcastItems();
  }

  /**
   * Broadcasts the list to all connected clients
   * Contains metadata and items of interests
   */
  private broadcastItems() {
    this.sendNetworkBroadcastEvent(InventoryEvents.BroadcastItems, {
      id: this.props[Inventory.ID],
      metadata: {
        title: this.props[Inventory.DISPLAYED_TITLE_KEY],
        titleIconId: this.icon?.id ?? BigInt(0),
        titleIconVersionId: this.icon?.versionId ?? BigInt(0)
      },
      items: this.Logic!.Items
    });
  }

  /**
   * Handles client requests for list data
   * Sends information to the requesting player
   *
   * @param player - The player requesting the list
   * @param id - Shop ID to identify which inventory is being requested
   */
  private OnItemsRequested({ player, id }: { player: hz.Player, id: string | null }) {
    if (!this.isRecipient(id)) {
      // Reject this request as it is not aimed at this inventory
      return;
    }

    // Send information directly to the requesting player
    this.sendNetworkBroadcastEvent(InventoryEvents.SendItems, {
      player: player, // Target specific player
      id: this.props[Inventory.ID],
      metadata: {
        title: this.props[Inventory.DISPLAYED_TITLE_KEY],
        titleIconId: this.icon?.id ?? BigInt(0),
        titleIconVersionId: this.icon?.versionId ?? BigInt(0)
      },
      items: this.Logic!.Items
    });
  }

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
  private OnItemUsed({ player, id, item }: { player: hz.Player, id: string | null, item: ItemDescription }) {
    if (!this.isRecipient(id)) {
      // Reject this request as it is not aimed at this inventory
      return;
    }

    // TODO : Use/Consume the object
    // This method is just here as an example and we recommend bypassing the Inventory class entirely
    // as your gameplay script could listened to the InventoryEvents.UseItem event themselves
    // and send the acknowledgement back.

    // Send acknowledgement back
    this.sendNetworkBroadcastEvent(InventoryEvents.AcknowledgeUseItem, {
      player: player,
      id: this.props[Inventory.ID],
      item: item
    });
  }

  /**
   * Handles requests for player entitlements
   * Retrieves and sends the player's owned items
   *
   * @param player - The player requesting entitlements
   * @param id - Inventory ID to identify which inventory is handling the request
   */
  private async OnEntitlementsRequested({ player, id }: { player: hz.Player, id: string | null }) {
    if (!this.isRecipient(id)) {
      // Reject this request as it is not aimed at this inventory
      return;
    }

    // Get player's entitlements (owned items) from logic
    const entitlements = await this.Logic!.getPlayerEntitlements(player);

    // Send entitlements to the requesting player
    this.sendNetworkBroadcastEvent(InventoryEvents.SendEntitlements, {
      player: player,
      id: this.props[Inventory.ID],
      entitlements: entitlements
    });
  }
}

/**
 * Register the Inventory component with the Horizon framework
 */
hz.Component.register(Inventory);
