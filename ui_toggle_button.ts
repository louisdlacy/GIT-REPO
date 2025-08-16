/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

// @generated version: FOMWYF

import * as hz from 'horizon/core';
import { NetworkEvent, Player } from 'horizon/core';
import { UINode, Binding, Pressable, Image, ImageSource, ViewStyle, ImageStyle, UIChildren, Bindable, FontFamily, UIComponent, View } from 'horizon/ui';

/**
 * An object that contains style-related properties that will be used by the Panel class.
 */
const StyleSheetBase = {
  // Main Panel Options
  PANEL_WIDTH: 660, // Width of the panel
  PANEL_RATIO: 1.375, // Ratio for panel dimensions, height will be calculated based on this
  PANEL_BACKGROUND_COLOR: 'transparent', // Background color of the component
  PANEL_BACKGROUND_COLOR_GRADIENT_A: '#202020D0', // Initial color for the panel background gradient
  PANEL_BACKGROUND_COLOR_GRADIENT_B: '#505560DA', // End color for the panel background gradient
  PANEL_BACKGROUND_COLOR_GRADIENT_ANGLE: '200deg', // Angle of the panel background gradient
  PANEL_FOOTER_HEIGHT: 80, // Height of the footer,

  // Border Options
  BORDER_WIDTH: 2, // Width of the default borders
  BORDER_COLOR: '#202020', // Outer color for borders
  BORDER_INNER_COLOR: '#AAAAAA', // Inner color for borders (when using the double border styling)

  // Margins, Paddings and gaps
  PADDING_LARGE: 24, // Large padding size
  PADDING_SMALL: 8, // Small padding size
  RADIUS_SMALL: 12, // Small radius size
  GAP_MINIMUM: 4, // Minimum gap size
  GAP_SMALL: 8, // Small gap size
  GAP_MEDIUM: 12, // Medium gap size

  // Text Options
  TEXT_COLOR_PRIMARY: "#EEEEEE", // Primary text color
  TEXT_COLOR_SECONDARY: "#CCCCCC", // Secondary text color
  TEXT_COLOR_BRIGHT: "#FFFFFF", // Bright text color
  TEXT_SIZE_TITLE: 18, // Text size for titles
  TEXT_SIZE_ITEM: 12, // Text size for items
  TEXT_SIZE_BUTTON: 14, // Text size for buttons
  TEXT_SIZE_BUTTON_CURRENCY: 10, // Text size for small buttons
  TEXT_SIZE_DESCRIPTION: 10, // Text size for descriptions
  TEXT_SIZE_LINE_HEIGHT: 24, // Line height for text
  TEXT_LINEHEIGHT_ITEM: 18, // Line height for items
  TEXT_LINEHEIGHT_DESCRIPTION: 12, // Line height for descriptions
  TEXT_LINEHEIGHT_BUTTON: 16, // Line height for buttons
  TEXT_WEIGHT_TITLE: "600" as Bindable<"700" | "400" | "600" | "normal" | "bold" | "100" | "200" | "300" | "500" | "800" | "900">, // Font weight for titles
  TEXT_WEIGHT_ITEM: "700" as Bindable<"700" | "400" | "600" | "normal" | "bold" | "100" | "200" | "300" | "500" | "800" | "900">, // Font weight for items
  TEXT_WEIGHT_DESCRIPTION: "400" as Bindable<"700" | "400" | "600" | "normal" | "bold" | "100" | "200" | "300" | "500" | "800" | "900">, // Font weight for descriptions
  TEXT_WEIGHT_BUTTON: "700" as Bindable<"700" | "400" | "600" | "normal" | "bold" | "100" | "200" | "300" | "500" | "800" | "900">, // Font weight for descriptions
  TEXT_FONT_PRIMARY: "Roboto" as FontFamily, // Primary font family

  // Button Options
  BUTTON_SIZE: 28, // Size of buttons
  BUTTON_BACKGROUND_COLOR: "#404040", // Background color of buttons
  BUTTON_BACKGROUND_COLOR_HOVER: "#606060", // Background color of buttons on hover
  BUTTON_BACKGROUND_COLOR_ACCENT: "#A72A82", // Accent background color of buttons
  BUTTON_CURRENCY_MIN_WIDTH: 64, // Minimum width of currency buttons

  // Toggle Overlay Button Options
  TOGGLE_OVERLAY_BUTTON_SIZE: 42, // Size of toggle overlay buttons

  // Item Options
  ITEM_WIDTH: 144, // Width of the item used in the grid
  ITEM_THUMBNAIL_HEIGHT: 108, // Height of the thumbnail used in the grid, this is not the full height of an item, because of possible texts below
  ITEM_THUMBNAIL_RADIUS: 8, // Radius of the thumbnail used in the grid
  ITEM_THUMBNAIL_TINT_NORMAL: "#FFFFFF", // Tint color of the thumbnail used in the grid
  ITEM_THUMBNAIL_TINT_GREYED_OUT: "#C0C0C0", // Greyed out color of the thumbnail used in the grid
};

/**
 * An object that contains style-related properties that will are computed from the StyleSheet object constants.
 */
const StyleSheet =
{
  ...StyleSheetBase,
  PANEL_HEIGHT: StyleSheetBase.PANEL_WIDTH / StyleSheetBase.PANEL_RATIO, // Height of the panel
  SCROLLVIEW_WIDTH: StyleSheetBase.PANEL_WIDTH - 2 * (StyleSheetBase.PADDING_LARGE) + StyleSheetBase.PADDING_SMALL, // Ideal width for the scroll view
  ITEM_HEIGHT: StyleSheetBase.ITEM_THUMBNAIL_HEIGHT + (StyleSheetBase.TEXT_SIZE_LINE_HEIGHT * 2), // Estimated height of an item
  SCROLLVIEW_TWO_LINES_HEIGHT: ((StyleSheetBase.ITEM_THUMBNAIL_HEIGHT + (StyleSheetBase.TEXT_SIZE_LINE_HEIGHT * 2)) * 2) + StyleSheetBase.GAP_SMALL,
  SCROLLVIEW_ONE_LINE_HEIGHT: StyleSheetBase.ITEM_THUMBNAIL_HEIGHT + (StyleSheetBase.TEXT_SIZE_LINE_HEIGHT * 2),
  BUTTON_RADIUS: StyleSheetBase.BUTTON_SIZE / 2, // Radius used for buttons (50% of the height will lead to a circle border)
  BUTTON_ICON_SIZE: StyleSheetBase.BUTTON_SIZE - 2 * StyleSheetBase.BORDER_WIDTH, // Size of the icons within a button (taking the border into account)
  BUTTON_ICON_RADIUS: (StyleSheetBase.BUTTON_SIZE - 2 * StyleSheetBase.BORDER_WIDTH) / 2, // Radius for icons within a button
  TOGGLE_OVERLAY_BUTTON_RADIUS: StyleSheetBase.TOGGLE_OVERLAY_BUTTON_SIZE / 2, // Radius for toggle overlay buttons
}

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

/**
 * Represents a proxy for an item used in a dynamic list. It is used to pass the index of the item to the render function of the DynamicList.
 * This proxy pattern allows us to maintain a lightweight reference to the actual item without duplicating the entire object.
 * Most of the logic will be handled by the owner of the dynamic list and the item class itself.
 */
type DynamicListItemProxy = {
  index: number
};

/**
 * PanelEvents object contains network events related to panel visibility management.
 * These events can be dispatched to show or hide panels for specific players.
 *
 * Each event carries information about:
 * - player: The Player instance for whom the panel should be shown/hidden
 * - id: The unique identifier of the panel (null means all panels)
 */
const PanelEvents = {
  /**
   * Event dispatched to show a panel for a specific player.
   * @param player - The player for whom to show the panel
   * @param id - The identifier of the panel to show (null for all panel)
   */
  ShowPanel: new NetworkEvent<{ player: Player, id: string | null }>('PanelEvents.ShowPanel'),

  /**
   * Event dispatched to hide a panel for a specific player.
   * @param player - The player for whom to hide the panel
   * @param id - The identifier of the panel to hide (null for all panels)
   */
  HidePanel: new NetworkEvent<{ player: Player, id: string | null }>('PanelEvents.HidePanel'),
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
abstract class LocalUI<T> extends UIComponent<T> {
  /**
   * Optional identifier for this UI component, used to target specific UI instances
   * when showing/hiding panels
   */
  protected id: string | null = null;

  /**
   * Hook method called during UI initialization.
   * Override this in child classes to perform custom post initialization logic.
   * This is called during the initializeUI() method, before the construct() method.
   */
  protected onInitializeUI() { }

  /**
   * Construct and return the UI node structure for this component.
   * This is called during the initializeUI() method.
   *
   * @returns The UI node structure to be rendered
   */
  protected abstract construct(): UINode;

  // Abstract Methods that must be implemented by the child class
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
  public get Player(): hz.Player { return this.entity.owner.get(); }

  /**
   * Gets the identifier for this UI component
   * @returns The component's ID or null if not set
   */
  public get Id(): string | null { return this.id; }

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
  public shouldShowForPlayer(player: hz.Player): boolean {
    return true;
  }

  /**
   * Determines if this UI component should respond to an event
   * based on the target player and optional ID
   *
   * @param player The player targeted by the event
   * @param id Optional ID to target a specific UI component
   * @returns True if this component should respond to the event
   */
  public isRecipient(player: hz.Player, id: string | null) {
    return this.Player === player && (id === null || this.Id === id);
  }

  /**
   * Lifecycle method called before start.
   * Sets up event connections and ensures the panel starts hidden.
   */
  public preStart() {
    // Connect to both local and network broadcast events for showing/hiding panels
    this.connectLocalBroadcastEvent(PanelEvents.ShowPanel, this.onReceivedShowPanel.bind(this));
    this.connectLocalBroadcastEvent(PanelEvents.HidePanel, this.onReceivedHidePanel.bind(this));
    this.connectNetworkBroadcastEvent(PanelEvents.ShowPanel, this.onReceivedShowPanel.bind(this));
    this.connectNetworkBroadcastEvent(PanelEvents.HidePanel, this.onReceivedHidePanel.bind(this));

    // Force hide the panel on start, ignoring the the properties of the entity
    // That's because those dispatchable UIs are not meant to be visible before assigned to a player
    this.hide();
  }

  /**
   * Lifecycle method called when the component starts.
   * Initializes the UI if not on the server player.
   */
  public start() {
    // Skip initialization for server player
    if (this.Player == this.world.getServerPlayer()) return;

    // Hide (again) the panel by default after initialization
    this.hide();

    // Call the abstract initialize method that child classes must implement
    this.initialize();
  }

  /**
   * Event handler for ShowPanel events.
   * Shows this panel if it matches the target player and ID.
   *
   * @param param0 Object containing the target player and optional ID
   */
  private onReceivedShowPanel({ player, id }: { player: hz.Player, id: string | null }) {
    // Only respond if this UI is the intended recipient
    if (!this.isRecipient(player, id)) return;

    this.show();
  }

  /**
   * Event handler for HidePanel events.
   * Hides this panel if it matches the target player and ID.
   *
   * @param param0 Object containing the target player and optional ID
   */
  private onReceivedHidePanel({ player, id }: { player: hz.Player, id: string | null }) {
    // Only respond if this UI is the intended recipient
    if (!this.isRecipient(player, id)) return;

    this.hide();
  }

  /**
   * Shows this UI component by setting its visibility to true.
   */
  public show() {
    // Only show the panel if it should be shown for the current player
    if (!this.shouldShowForPlayer(this.Player)) return;

    this.setVisibility(true);
  }

  /**
   * Hides this UI component by setting its visibility to false.
   */
  public hide() {
    this.setVisibility(false);
  }

  /**
   * Sets the visibility state of this UI component and triggers appropriate callbacks.
   *
   * @param visible Whether the component should be visible
   */
  public setVisibility(visible: boolean) {
    // Update the entity's visibility property
    this.entity.visible.set(visible);

    // Call the appropriate lifecycle hook based on visibility
    if (visible) this.onShow();
    else this.onHide();
  }

  /**
   * Hook method called when the UI becomes visible.
   * Override in child classes to perform actions when the UI is shown.
   */
  protected onShow() { }

  /**
   * Hook method called when the UI becomes hidden.
   * Override in child classes to perform actions when the UI is hidden.
   */
  protected onHide() { }

  /**
   * Initializes the UI by wrapping a dynamic list in a centered anchor view.
   * This method is called automatically very early on to create the actual UI structure.
   *
   * @returns The root View for this UI component
   */
  initializeUI() {
    // This very early initialization needs to occur to preload some textures required by the UI
    // Additionally, they need to be called by the server as well
    this.onInitializeUI();

    // If the panel is being initialized for the server player, we won't construct anything
    // Just return an empty view
    if (this.Player == this.world.getServerPlayer()) return View({});

    // Create and return the main view with the constructed UI and specified anchor style
    return View({
      children: this.construct(),
      style: this.AnchorStyle
    });
  }
}

/**
 * Utility class providing methods for UI element manipulation, such as wrapping elements in a flex container with optional border overlays.
 */
class Utils {
  /**
   * Wraps the given children in a flex container with optional border overlays.
   * @param children - The UI elements to be wrapped.
   * @param style - The style to be applied to the flex container.
   * @param borderAsOverlay - Determines if the border should be an overlay.
   * @param doubleBorder - Determines if a double border should be applied.
   * @returns The children wrapped in a flex container with optional borders.
   */
  static WrapInFlex({ children, style, borderAsOverlay, doubleBorder, borderStyleOverride }: {
    children: UIChildren | undefined,
    style: ViewStyle,
    borderAsOverlay: boolean,
    doubleBorder: boolean,
    borderStyleOverride?: Partial<ViewStyle>
  }): UIChildren {
    const borders = Utils.BuildDoubleBorderOverlay({
      radius: style.borderRadius,
      double: doubleBorder,
      styleOverride: borderStyleOverride
    });
    const flex = View({
      children: children,
      style: style
    });
    return borderAsOverlay ? [flex, borders] : [borders, flex];
  }

  /**
   * Builds a double border overlay view.
   * @param radius - The border radius to be applied.
   * @param double - Determines if a double border should be created.
   * @returns A UI node representing the border overlay.
   */
  static BuildDoubleBorderOverlay({ radius, double, styleOverride }: {
    radius: Bindable<number> | undefined,
    double: boolean,
    styleOverride?: Partial<ViewStyle>
  }): UINode {
    // Check if radius is a Binding instance
    let radiusValue: Binding<number>;
    if (radius instanceof Binding) {
      // If it's a Binding, we can use it directly
      radiusValue = radius;
    } else {
      // Otherwise, create a new Binding with the value
      radiusValue = new Binding<number>((radius as number) ?? 2);
    }

    return View({
      children: double ? View({
        style: {
          top: 0,
          left: 0,
          position: 'absolute',
          borderWidth: StyleSheet.BORDER_WIDTH,
          borderColor: StyleSheet.BORDER_INNER_COLOR,
          borderRadius: radiusValue.derive(r => r - 2),
          width: '100%',
          height: '100%',
        }
      }
      ) : undefined,
      style: {
        top: 0,
        left: 0,
        position: 'absolute',
        borderWidth: StyleSheet.BORDER_WIDTH,
        borderColor: StyleSheet.BORDER_COLOR,
        borderRadius: radiusValue,
        width: '100%',
        height: '100%',
        ...styleOverride
      }
    });
  }
}

/**
 * A UI component that renders a circular toggle button with an icon.
 * When clicked, it broadcasts an event to show another panel identified by idToToggle.
 * Those buttons are meant to only work on Mobile devices (as opposed to VR)
 */
export class UiToggleButton extends LocalUI<typeof UiToggleButton> {
  /**
   * Component properties definition
   * - id: Unique identifier for this button
   * - iconTexture: Asset reference for the button's icon
   * - idToToggle: ID of the panel to toggle when clicked
   * - positionRight: Distance from right edge (default: "10%")
   * - positionTop: Distance from top edge (default: "20%")
   */
  public static propsDefinition =
    {
      id: { type: hz.PropTypes.String, default: null },
      iconTexture: { type: hz.PropTypes.Asset, default: null },
      idToToggle: { type: hz.PropTypes.String, default: null },
      positionRight: { type: hz.PropTypes.String, default: "10%" },
      positionTop: { type: hz.PropTypes.String, default: "20%" },
    };

  /** Background color binding that changes on hover */
  private readonly backgroundColor = new Binding<string>(StyleSheet.BUTTON_BACKGROUND_COLOR);

  /** Icon image source */
  private icon: ImageSource | null = null;

  /** Button style definition */
  private readonly style: ViewStyle = {
    backgroundColor: this.backgroundColor,
    borderRadius: StyleSheet.TOGGLE_OVERLAY_BUTTON_RADIUS,
    height: StyleSheet.TOGGLE_OVERLAY_BUTTON_SIZE,
    width: StyleSheet.TOGGLE_OVERLAY_BUTTON_SIZE
  }

  private readonly iconStyle: ImageStyle = {
    alignSelf: "center",
    height: '100%',
    width: '100%',
    tintColor: StyleSheet.TEXT_COLOR_PRIMARY
  }

  /**
   * Defines the positioning style for the button
   * Sets the button at absolute position with coordinates from props
   */
  protected get AnchorStyle(): ViewStyle {
    return {
      position: "absolute",
      width: 0,
      height: 0,
      right: this.props.positionRight,
      top: this.props.positionTop
    }
  }

  /**
   * Determines if the button should be shown for the player
   * Only shows the button if the device is not VR, because
   * players can't interact with the button in VR
   * @param player The player to check
   * @returns False if the device is VR, true otherwise
   */
  public shouldShowForPlayer(player: hz.Player): boolean {
    return player.deviceType.get() != hz.PlayerDeviceType.VR;
  }

  /**
   * Initializes the UI component
   * Sets the component ID and loads the icon texture
   */
  protected onInitializeUI() {
    super.onInitializeUI();
    this.id = this.props.id;
    this.icon = this.props.iconTexture ? ImageSource.fromTextureAsset(this.props.iconTexture as hz.TextureAsset) : null;
  }

  /**
   * Called when the component is initialized
   * Makes the button visible
   */
  protected initialize(): void {
    this.show();
  }

  /**
   * Creates the button UI structure
   * @returns A Pressable UINode with the button's appearance and behavior
   */
  protected constructButton(): UINode {
    const children: UIChildren = [Image({ source: this.icon, style: this.iconStyle })];

    return Pressable({
      children: Utils.WrapInFlex({
        children: children,
        style: {
          borderRadius: StyleSheet.TOGGLE_OVERLAY_BUTTON_RADIUS,
          padding: StyleSheet.PADDING_SMALL,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          height: '100%',
          width: '100%',
        },
        borderAsOverlay: true,
        doubleBorder: true
      }),
      // Handles click event by broadcasting a ShowPanel event with the target panel ID
      onClick: (_: hz.Player) => {
        this.sendLocalBroadcastEvent(PanelEvents.ShowPanel, { player: this.Player, id: this.props.idToToggle });
      },
      // Changes background color when mouse enters button area
      onEnter: (_: hz.Player) => {
        this.backgroundColor.set(StyleSheet.BUTTON_BACKGROUND_COLOR_HOVER);
      },
      // Restores original background color when mouse leaves button area
      onExit: (_: hz.Player) => {
        this.backgroundColor.set(StyleSheet.BUTTON_BACKGROUND_COLOR);
      },
      style: this.style
    });
  }

  /**
   * Main UI construction method
   * @returns The complete button UI node
   */
  protected construct() {
    return this.constructButton();
  }
}

// Register the component with the Horizon framework
hz.Component.register(UiToggleButton);
