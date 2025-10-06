import { Component, PropTypes, NetworkEvent } from 'horizon/core';

/**
 * Network event to request a toggle of the scoring system's state.
 */
const OnToggleScoringRequest = new NetworkEvent<{}>('OnToggleScoringRequest');

/**
 * Network event to request a toggle of the shop system's state.
 */
const OnToggleShopRequest = new NetworkEvent<{}>('OnToggleShopRequest');

/**
 * ControlRoomManager serves as a central state manager for game configuration.
 * It holds flags to enable or disable various game systems.
 */
class ControlRoomManager extends Component<typeof ControlRoomManager> {
  static propsDefinition = {};

  // Public flags for different game systems.
  public isScoringEnabled: boolean = false;
  public isShopEnabled: boolean = false;
  public isPuzzleEnabled: boolean = false;
  public isAccessibilityEnabled: boolean = false;

  override start() {
    console.log("ControlRoomManager started. All systems are initially disabled.");

    // Listen for network requests to toggle the scoring system.
    this.connectNetworkBroadcastEvent(OnToggleScoringRequest, () => {
      this.isScoringEnabled = !this.isScoringEnabled;
      console.log(`Scoring system enabled: ${this.isScoringEnabled}`);
    });

    // Listen for network requests to toggle the shop system.
    this.connectNetworkBroadcastEvent(OnToggleShopRequest, () => {
      this.isShopEnabled = !this.isShopEnabled;
      console.log(`Shop system enabled: ${this.isShopEnabled}`);
    });
  }

  /**
   * Toggles the scoring system on or off.
   * @param enabled - The new state for the scoring system.
   */
  public toggleScoring(enabled: boolean): void {
    this.isScoringEnabled = enabled;
    console.log(`Scoring system enabled: ${this.isScoringEnabled}`);
  }

  /**
   * Toggles the shop system on or off.
   * @param enabled - The new state for the shop system.
   */
  public toggleShop(enabled: boolean): void {
    this.isShopEnabled = enabled;
    console.log(`Shop system enabled: ${this.isShopEnabled}`);
  }

  /**
   * Toggles the puzzle system on or off.
   * @param enabled - The new state for the puzzle system.
   */
  public togglePuzzle(enabled: boolean): void {
    this.isPuzzleEnabled = enabled;
    console.log(`Puzzle system enabled: ${this.isPuzzleEnabled}`);
  }

  /**
   * Toggles the accessibility system on or off.
   * @param enabled - The new state for the accessibility system.
   */
  public toggleAccessibility(enabled: boolean): void {
    this.isAccessibilityEnabled = enabled;
    console.log(`Accessibility system enabled: ${this.isAccessibilityEnabled}`);
  }
}

Component.register(ControlRoomManager);