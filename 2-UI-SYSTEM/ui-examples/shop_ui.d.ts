/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
import * as hz from 'horizon/core';
import { Player } from 'horizon/core';
import { Binding, ImageSource, UINode, ViewStyle, UIChildren, UIComponent } from 'horizon/ui';
/**
 * Represents an item in a grid. It is responsible for converting itself to a UINode.
 * We're using this interface instead of a class because we want to allow using different types of items in the grid or letting creators
 * create their own item classes.
 *
 * Implementers of this interface must provide a toUINode method that converts the item to a renderable UI node.
 */
interface IUIElement {
    /**
     * Converts the item to a UINode for rendering
     * @param index - The position of this item in the grid
     * @param numberOfItems - The total number of items in the grid
     * @returns A UINode representing this item
     */
    toUINode(index: number, numberOfItems: number): UINode;
}
declare abstract class UIElement implements IUIElement {
    protected readonly style: ViewStyle;
    constructor(styleOverrides?: Partial<ViewStyle>);
    abstract toUINode(index: number, numberOfItems: number): UINode;
}
/**
 * Represents a grid layout. It is responsible for managing the items and rendering them as a grid.
 * It also handles the scrolling using a ScrollView UI node.
 *
 * The Grid uses a wrapped flex layout to arrange items in rows, automatically wrapping to the next row
 * when the current row is filled. This creates a responsive grid that adapts to different screen sizes.
 */
declare class Grid extends UIElement {
    /**
     * The width of the grid in pixels.
     * This property is used to track and manage the grid's horizontal dimension.
     */
    private width;
    /**
     * Gets the current width of the grid.
     * @returns The width value.
     */
    get Width(): number;
    /**
     * The height of the grid in pixels.
     * This property is used to track and manage the grid's vertical dimension.
     */
    private height;
    /**
     * Gets the current height of the grid.
     * @returns The height value.
     */
    get Height(): number;
    /**
     * Determines if the grid should scroll horizontally.
     * When true, the grid will scroll horizontally; when false (default), it will scroll vertically.
     */
    private horizontal;
    /**
     * Gets whether the grid scrolls horizontally.
     * @returns True if the grid scrolls horizontally, false if it scrolls vertically.
     */
    get isHorizontal(): boolean;
    /**
     * Creates a new Grid instance.
     * @param horizontal - Optional parameter to set horizontal scrolling.
     * @param width - Optional parameter to set the initial width of the grid.
     * @param height - Optional parameter to set the initial height of the grid.
     */
    constructor(horizontal: boolean, width: number, height: number);
    /**
     * The collection of items to be displayed in the grid
     */
    private Items;
    /**
     * Style for the wrapped flex container that holds the grid items
     */
    private readonly wrappedFlexStyle;
    /**
     * Style for the ScrollView that contains the grid
     */
    private readonly scrollViewStyle;
    /**
     * A binding that holds proxies to the grid items
     * This is used by the DynamicList to efficiently render only the visible items
     */
    private readonly ItemsData;
    /**
     * Renders an item as a UINode based on the provided item proxy and optional index.
     * This method is called by the DynamicList for each visible item in the grid.
     *
     * @param itemProxy - The proxy containing the index of the item to render.
     * @param index - An optional index to override the item proxy index.
     * @returns A UINode representing the rendered item.
     */
    private renderItems;
    /**
     * Sets the items to be managed by the grid and updates the binding data.
     * This method should be called whenever the grid's content needs to be updated.
     *
     * @param items - An array of items to be displayed in the grid.
     */
    setItems(items: IUIElement[]): void;
    /**
     * Constructs the content for the grid layout.
     * This method creates a DynamicList of IUIElements.
     *
     * @returns An array of UINodes representing the grid's content
     */
    constructContent(): UINode[];
    /**
     * Constructs and returns a UINode representing the grid layout with scrollable content.
     * This is the main method to call when you want to render the grid.
     *
     * @returns A UINode for the grid's scrollable content.
     */
    toUINode(): UINode;
}
/**
 * Abstract base class for creating buttons.
 *
 * This class provides the foundation for building interactive buttons with
 * consistent styling and behavior. Subclasses should implement the constructContent()
 * method to define the actual content of the button.
 */
export declare abstract class Button extends UIElement {
    /**
     * Default button styling properties.
     * These define the visual appearance of all buttons created from this class.
     * The style uses values from the StyleSheet constants for consistency.
     */
    protected readonly style: ViewStyle;
    /**
     * Styling for the flex style within the button.
     */
    protected readonly flexStyle: ViewStyle;
    /**
     * Constructs the content to be displayed inside the button.
     *
     * @returns An array of UINode elements to render inside the button.
     * Subclasses need to implement this method to provide custom content.
     */
    protected abstract constructContent(): UINode[];
    /**
     * Handles the click event for the button.
     *
     * This method is called when the button is clicked. Subclasses should
     * override this method to implement custom click behavior.
     */
    protected onClick(player: Player): void;
    /**
     * Determines if the button can be clicked.
     *
     * @returns A boolean indicating whether the button is clickable.
     * Subclasses can override this to implement conditional clickability.
     */
    protected canBeClicked(player: Player): boolean;
    /**
     * Handles the pointer enter event for the button.
     *
     * This method is called when a pointer enters the button area.
     * Subclasses can override this to implement hover effects.
     */
    protected onEnter(player: Player): void;
    /**
     * Handles the pointer exit event for the button.
     *
     * This method is called when a pointer leaves the button area.
     * Subclasses can override this to reset hover effects.
     */
    protected onExit(player: Player): void;
    /**
     * Converts the button into a UINode that can be rendered.
     *
     * This method creates a Pressable component with the button's content
     * and event handlers. It handles the logic for when callbacks should be executed.
     *
     * @returns A UINode representing the button.
     */
    toUINode(): UINode;
}
/**
 * Abstract base class for local UI components that can be shown/hidden for specific players.
 *
 * The LocalUI class provides core functionality for:
 * - Managing UI visibility states
 * - Handling show/hide events from both local and network sources
 * - Providing a structured initialization flow
 *
 * This class is designed to be pooled and assigned to a specific player during initialization.
 * We recommend using the Asset Pooling gizmo to manage the assignment to players.
 *
 * @template T The type parameter for the UIComponent base class
 */
declare abstract class LocalUI<T> extends UIComponent<T> {
    /**
     * Optional identifier for this UI component, used to target specific UI instances
     * when showing/hiding panels
     */
    protected id: string | null;
    /**
     * Hook method called during UI initialization.
     * Override this in child classes to perform custom post initialization logic.
     * This is called during the initializeUI() method, before the construct() method.
     */
    protected onInitializeUI(): void;
    /**
     * Construct and return the UI node structure for this component.
     * This is called during the initializeUI() method.
     *
     * @returns The UI node structure to be rendered
     */
    protected abstract construct(): UINode;
    /**
     * This is called once the player has been properly assigned to this component.
     * Which is after initializeUI(), during start().
     */
    protected abstract initialize(): void;
    /**
     * Define the anchor style for positioning this UI component.
     * @returns The ViewStyle object defining positioning and layout
     */
    protected abstract get AnchorStyle(): ViewStyle;
    /**
     * Gets the player that owns this UI component
     * @returns The player instance that owns this component
     */
    get Player(): hz.Player;
    /**
     * Gets the identifier for this UI component
     * @returns The component's ID or null if not set
     */
    get Id(): string | null;
    /**
     * Determines if this UI component should be shown for a specific player.
     * Override in child classes to implement custom visibility logic based
     * on player state or properties.
     *
     * @param player The player to check visibility for
     * @returns True if the UI should be shown for this player, false otherwise
     *
     * @remarks Default implementation always returns true
     */
    shouldShowForPlayer(player: hz.Player): boolean;
    /**
     * Determines if this UI component should respond to an event
     * based on the target player and optional ID
     *
     * @param player The player targeted by the event
     * @param id Optional ID to target a specific UI component
     * @returns True if this component should respond to the event
     */
    isRecipient(player: hz.Player, id: string | null): boolean;
    /**
     * Lifecycle method called before start.
     * Sets up event connections and ensures the panel starts hidden.
     */
    preStart(): void;
    /**
     * Lifecycle method called when the component starts.
     * Initializes the UI if not on the server player.
     */
    start(): void;
    /**
     * Event handler for ShowPanel events.
     * Shows this panel if it matches the target player and ID.
     *
     * @param param0 Object containing the target player and optional ID
     */
    private onReceivedShowPanel;
    /**
     * Event handler for HidePanel events.
     * Hides this panel if it matches the target player and ID.
     *
     * @param param0 Object containing the target player and optional ID
     */
    private onReceivedHidePanel;
    /**
     * Shows this UI component by setting its visibility to true.
     */
    show(): void;
    /**
     * Hides this UI component by setting its visibility to false.
     */
    hide(): void;
    /**
     * Sets the visibility state of this UI component and triggers appropriate callbacks.
     *
     * @param visible Whether the component should be visible
     */
    setVisibility(visible: boolean): void;
    /**
     * Hook method called when the UI becomes visible.
     * Override in child classes to perform actions when the UI is shown.
     */
    protected onShow(): void;
    /**
     * Hook method called when the UI becomes hidden.
     * Override in child classes to perform actions when the UI is hidden.
     */
    protected onHide(): void;
    /**
     * Initializes the UI by wrapping a dynamic list in a centered anchor view.
     * This method is called automatically very early on to create the actual UI structure.
     *
     * @returns The root View for this UI component
     */
    initializeUI(): UINode<import("horizon/ui").ViewProps>;
}
/**
 * Abstract base class for creating UI panels with standardized layout and behavior.
 * Extends LocalUI to inherit basic UI functionality like show/hide, and player assignement.
 */
declare abstract class Panel extends LocalUI<typeof Panel> {
    /**
     * Defines the properties that can be passed to the Panel component.
     * - id: Unique identifier for the panel
     * - closeIconTexture: Asset for the close button icon
     * - metaCreditsThumbnail: Asset for the Meta Credits icon
     * - spinnerTexture: Asset for a spinner icon
     */
    static propsDefinition: {
        id: {
            type: "string";
            default: null;
        };
        closeIconTexture: {
            type: "Asset";
        };
        metaCreditsThumbnail: {
            type: "Asset";
        };
        spinnerTexture: {
            type: "Asset";
        };
    };
    /**
     * Style for the main panel view
     */
    private readonly panelStyle;
    /**
     * Style for the main panel flex
     */
    private readonly panelFlexStyle;
    /**
     * Style for the title text
     */
    private readonly titleStyle;
    /**
     * Style for the optional title icon
     */
    private readonly titleIconStyle;
    /**
     * Style for the header view
     */
    private readonly headerStyle;
    /**
     * Style for the footer view
     */
    private readonly footerStyle;
    /**
     * Flag indicating whether the panel is currently in a busy state.
     * When true, the panel may show loading indicators or disable user interactions.
     */
    private busy;
    /**
     * Array of Button components to be displayed in the panel header.
     */
    protected HeaderButtons: Button[];
    /**
     * Binding for the header buttons data used by the DynamicList component.
     * Updates when setButtons is called.
     */
    private readonly HeaderButtonsData;
    /**
     * ImageSource for the close button icon.
     * Initialized in onInitializeUI from props.
     */
    private closeIcon;
    /**
     * ImageSource for the Meta Credits icon.
     * Initialized in onInitializeUI from props.
     */
    metaCreditsIcon: ImageSource | null;
    /**
     * ImageSource for the spinner icon used to indicate loading states.
     * Initialized in onInitializeUI from props.
     */
    spinnerIcon: ImageSource | null;
    /**
     * Gets the busy state of the panel.
     * When busy, the panel may show loading indicators or disable interactions.
     *
     * @returns Current busy state as boolean
     */
    get Busy(): boolean;
    /**
     * Sets the busy state of the panel.
     * When set to true, the panel may show loading indicators or disable interactions.
     * Calls refreshBindings() to update UI elements that depend on the busy state.
     *
     * @param value - New busy state to set
     */
    set Busy(value: boolean);
    /**
     * Returns the style for the anchor element that centers the panel.
     * Used as a positioning reference point.
     */
    protected get AnchorStyle(): ViewStyle;
    /**
     * Initializes the UI components and assets.
     * Called first in the initializeUI() method.
     */
    protected onInitializeUI(): void;
    /**
     * Renders a button for the header based on the provided ButtonProxy.
     * Used as the renderItem callback for the DynamicList component.
     *
     * @param itemProxy - The ButtonProxy object containing the button index
     * @param _ - Optional index parameter (unused but required by DynamicList interface)
     * @returns A UINode representing the rendered button
     */
    private renderButton;
    /**
     * Sets the buttons to be displayed in the panel header.
     * Updates the HeaderButtonsData binding to reflect the new buttons.
     *
     * @param items - Array of Button components to display in the header
     */
    setButtons(items: Button[]): void;
    /**
     * Constructs the main panel view with specified children and styles.
     * Creates a flex container that will hold the header, content, and footer.
     *
     * @param children - Optional UI elements to include in the panel
     * @returns A UINode representing the panel
     */
    protected constructPanel(children?: UIChildren): UINode;
    /**
     * Constructs an exit button with hover effects and click functionality to hide the panel.
     * The button changes background color on hover and closes the panel when clicked.
     *
     * @returns A UINode representing the exit button
     */
    protected constructExitButton(): UINode;
    /**
     * Constructs a header view with a title, optional icon, and an exit button.
     * Also includes any additional buttons set via setButtons().
     *
     * @param title - The title text or binding to display in the header
     * @param icon - Optional icon to display next to the title
     * @returns A UINode representing the header
     */
    protected constructHeader(title: Binding<string> | string, icon: Binding<ImageSource> | ImageSource | undefined): UINode;
    /**
     * Constructs a footer view with optional children.
     * The footer is positioned at the bottom of the panel.
     *
     * @param children - Optional UI elements to include in the footer
     * @returns A UINode representing the footer
     */
    protected constructFooter(children?: UINode): UINode;
    /**
     * Refreshes all bindings that depend on the panel's state.
     * This method is called when the panel's state changes, such as when the busy state is updated.
     * Override this method in derived classes to update specific bindings as needed.
     */
    protected refreshBindings(): void;
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
 * ShopUI - Main shop interface component that extends Panel
 *
 * Responsible for:
 * - Displaying purchasable items in a grid layout
 * - Showing available currencies
 * - Handling purchase transactions
 * - Tracking player entitlements (owned items)
 */
export declare class ShopUI extends Panel {
    /** Collection of shop items to be displayed in the grid */
    private items;
    /** Collection of currency buttons displayed in the shop */
    private currencies;
    /** Player's owned items/currencies */
    private entitlements;
    /** Grid layout for organizing shop items */
    private grid;
    /** Popup used for feedbacks */
    private popup;
    /** Shop title binding - updates the UI when changed */
    private readonly title;
    /** Shop icon binding - updates the UI when changed */
    private readonly titleIcon;
    /**
     * Returns the grid layout component used for organizing items
     * @returns The Grid instance or undefined if not initialized
     */
    get Grid(): Grid | undefined;
    /**
     * Initialize the shop component
     * Sets up network event listeners and requests initial shop data
     */
    protected initialize(): void;
    /**
     * Request shop content from the server
     * Sends player ID and component ID for targeted response
     */
    private requestContent;
    /**
     * Handle broadcast shop content updates
     * Forwards the data to onContentReceived with the current player
     *
     * @param id - Target component ID or null for broadcast
     * @param metadata - Shop metadata including title and icon
     * @param list - List of purchasable items
     * @param currencies - List of available currencies
     */
    private onContentBroadcastReceived;
    /**
     * Process received shop content
     * Updates UI with shop items and currencies
     *
     * @param player - Target player
     * @param id - Target component ID or null for broadcast
     * @param metadata - Shop metadata including title and icon
     * @param list - List of purchasable items
     * @param currencies - List of available currencies
     */
    private onContentReceived;
    /**
     * Get the quantity of a specific currency owned by the player
     *
     * @param item - The currency item to check
     * @returns The quantity owned or 0 if none
     */
    getCurrencyEntitlement(item: ShopItemDescription): number;
    /**
     * Request player's entitlements (owned items) from the server
     */
    private requestEntitlements;
    /**
     * Process received entitlements data
     * Updates UI to reflect owned items and currencies
     *
     * @param player - Target player
     * @param id - Target component ID or null for broadcast
     * @param list - List of player's entitlements
     */
    private onEntitlementsReceived;
    /**
     * Initiates a purchase transaction for a shop item
     *
     * This method:
     * 1. Sets the UI to busy state to prevent multiple purchases
     * 2. Sends a purchase request to the server with player and item data
     *
     * @param item - The shop item description to purchase
     */
    purchase(item: ShopItemDescription): void;
    /**
     * Handle purchase receipt from server
     * Can be extended to show success/failure messages or update UI
     *
     * @param player - Target player
     * @param id - Target component ID or null for broadcast
     * @param item - The purchased item
     * @param result - Whether the purchase was successful
     */
    private onReceiptReceived;
    /**
     * Refreshes the bindings for all shop items
     *
     * This method iterates through all shop items and calls their refreshBindings method
     * to update their visual state based on current data.
     */
    protected refreshBindings(): void;
    /**
     * Construct the shop UI layout
     * Creates header with title and icon, and grid for shop items
     *
     * @returns The constructed panel element
     */
    protected construct(): UINode<any>;
}
export {};
