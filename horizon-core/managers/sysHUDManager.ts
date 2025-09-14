import { Component, PropTypes, Entity, Player, TextGizmo, NetworkEvent } from 'horizon/core';

// Define the event locally to listen for broadcasts from other systems.
// This must match the definition in the sending script (e.g., sysPlayerStatsManager).
const OnPlayerStatChanged = new NetworkEvent<{ player: Player; statName: string; newValue: number }>('OnPlayerStatChanged');

// Forward declaration for type-checking, assuming sysAccessibilityManager is available in the runtime scope.
declare class sysAccessibilityManager extends Component<typeof sysAccessibilityManager> {
  static propsDefinition: {
    textScale: { type: typeof PropTypes.Number; default: number };
    highContrastUI: { type: typeof PropTypes.Boolean; default: boolean };
  };
  start(): void;
}

/**
 * HUD Manager
 * Displays information to the player's screen (inventory, health, etc.).
 */
class sysHUDManager extends Component<typeof sysHUDManager> {
  static propsDefinition = {
    gfcConfiguration: { type: PropTypes.Entity },
    scoreText: { type: PropTypes.Entity },
    healthText: { type: PropTypes.Entity },
  };

  override preStart() {
    // Check if the TextGizmo properties are assigned in the editor.
    if (!this.props.scoreText || !this.props.healthText) {
      console.warn("sysHUDManager: 'scoreText' or 'healthText' property is not assigned. Please link a TextGizmo entity in the editor to display stats.");
    }

    this.connectNetworkBroadcastEvent(OnPlayerStatChanged, (payload) => {
      // Only update the HUD for the local player
      if (payload.player.id === this.world.getLocalPlayer().id) {
        switch (payload.statName) {
          case 'score':
            // Re-verify the property is not null before updating text.
            if (this.props.scoreText) {
              this.props.scoreText.as(TextGizmo).text.set(`Score: ${payload.newValue}`);
            }
            break;
          case 'health':
            // Re-verify the property is not null before updating text.
            if (this.props.healthText) {
              this.props.healthText.as(TextGizmo).text.set(`Health: ${payload.newValue}`);
            }
            break;
        }
      }
    });
  }

  override start() {
    console.log("sysHUDManager started.");
  }

  updateHUD(data: any) {
    console.log("HUD updated:", data);

    // Get the gfcConfiguration entity from props.
    const configEntity = this.props.gfcConfiguration;
    if (!configEntity) {
      console.error("sysHUDManager: 'gfcConfiguration' property is not assigned.");
      return;
    }

    // Get the sysAccessibilityManager component from the config entity.
    // Note: In a real implementation, you would get the sysConfiguration component first,
    // then get the accessibilityManager entity from its props. This is a simplified approach.
    const accessibilityComps = configEntity.getComponents("sysAccessibilityManager" as any);
    if (accessibilityComps && accessibilityComps.length > 0) {
      const accessibilityComp = accessibilityComps[0] as sysAccessibilityManager;
      const textScale = accessibilityComp.props.textScale;
      const highContrastUI = accessibilityComp.props.highContrastUI;
      console.log(`Accessibility settings read: textScale=${textScale}, highContrastUI=${highContrastUI}`);
    } else {
      console.error("sysHUDManager: Could not find 'sysAccessibilityManager' component on the entity provided by gfcConfiguration.");
    }
    
    // TODO: implement UI binding
  }
}

Component.register(sysHUDManager);