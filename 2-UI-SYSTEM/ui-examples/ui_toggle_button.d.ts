/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
import * as hz from 'horizon/core';
import { UINode, ViewStyle, UIComponent } from 'horizon/ui';
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
 * A UI component that renders a circular toggle button with an icon.
 * When clicked, it broadcasts an event to show another panel identified by idToToggle.
 * Those buttons are meant to only work on Mobile devices (as opposed to VR)
 */
export declare class UiToggleButton extends LocalUI<typeof UiToggleButton> {
    /**
     * Component properties definition
     * - id: Unique identifier for this button
     * - iconTexture: Asset reference for the button's icon
     * - idToToggle: ID of the panel to toggle when clicked
     * - positionRight: Distance from right edge (default: "10%")
     * - positionTop: Distance from top edge (default: "20%")
     */
    static propsDefinition: {
        id: {
            type: "string";
            default: null;
        };
        iconTexture: {
            type: "Asset";
            default: null;
        };
        idToToggle: {
            type: "string";
            default: null;
        };
        positionRight: {
            type: "string";
            default: string;
        };
        positionTop: {
            type: "string";
            default: string;
        };
    };
    /** Background color binding that changes on hover */
    private readonly backgroundColor;
    /** Icon image source */
    private icon;
    /** Button style definition */
    private readonly style;
    private readonly iconStyle;
    /**
     * Defines the positioning style for the button
     * Sets the button at absolute position with coordinates from props
     */
    protected get AnchorStyle(): ViewStyle;
    /**
     * Determines if the button should be shown for the player
     * Only shows the button if the device is not VR, because
     * players can't interact with the button in VR
     * @param player The player to check
     * @returns False if the device is VR, true otherwise
     */
    shouldShowForPlayer(player: hz.Player): boolean;
    /**
     * Initializes the UI component
     * Sets the component ID and loads the icon texture
     */
    protected onInitializeUI(): void;
    /**
     * Called when the component is initialized
     * Makes the button visible
     */
    protected initialize(): void;
    /**
     * Creates the button UI structure
     * @returns A Pressable UINode with the button's appearance and behavior
     */
    protected constructButton(): UINode;
    /**
     * Main UI construction method
     * @returns The complete button UI node
     */
    protected construct(): UINode<any>;
}
export {};
