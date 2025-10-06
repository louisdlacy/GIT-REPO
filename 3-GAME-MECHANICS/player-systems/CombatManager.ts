import { Component, PropTypes, Player, Entity, NetworkEvent } from 'horizon/core';

// Forward declaration for component types to inform TypeScript about their methods.
declare class sysPlayerStatsManager extends Component {
  public takeDamage(player: Player, amount: number): void;
  start(): void;
}

declare class sysConfiguration extends Component<typeof sysConfiguration> {
  static propsDefinition: {
    playerStatsManager: { type: typeof PropTypes.Entity };
  };
  start(): void;
}

/**
 * Network event to broadcast when a player has taken damage.
 * The payload includes the player who was damaged and the amount of damage taken.
 */
export const OnPlayerDamaged = new NetworkEvent<{ player: Player, damage: number }>('OnPlayerDamaged');

/**
 * CombatManager
 * Acts as a central hub for handling combat-related events, such as player damage.
 */
class CombatManager extends Component<typeof CombatManager> {
  static propsDefinition = {
    // A reference to the central configuration entity (gfcConfiguration).
    gfcConfiguration: { type: PropTypes.Entity },
  };

  /**
   * In preStart, we set up our event listeners. This ensures they are ready
   * before any other scripts might try to send events in their start methods.
   */
  override preStart() {
    // Listen for the global 'OnPlayerDamaged' network event.
    this.connectNetworkBroadcastEvent(OnPlayerDamaged, (payload) => {
      this.handlePlayerDamaged(payload.player, payload.damage);
    });
  }

  /**
   * In start, we log that the manager is active.
   */
  override start() {
    console.log("CombatManager started and is listening for damage events.");
  }

  /**
   * Handles the 'OnPlayerDamaged' event by finding the stats manager
   * through the central configuration entity and applying damage.
   * @param player The player who was damaged.
   * @param damage The amount of damage taken.
   */
  private handlePlayerDamaged(player: Player, damage: number): void {
    console.log(`CombatManager: Processing damage event for ${player.name.get()}. Damage: ${damage}`);

    // 1. Get the gfcConfiguration entity from props.
    const configEntity = this.props.gfcConfiguration;
    if (!configEntity) {
      console.error("CombatManager: 'gfcConfiguration' property is not assigned.");
      return;
    }

    // 2. Get the sysConfiguration component from that entity.
    const configComponents = configEntity.getComponents(sysConfiguration);
    if (!configComponents || configComponents.length === 0) {
      console.error("CombatManager: Could not find 'sysConfiguration' component on the provided gfcConfiguration entity.");
      return;
    }
    const config = configComponents[0];

    // 3. From the sysConfiguration component's props, get the playerStatsManager entity.
    const statsManagerEntity = config.props.playerStatsManager;
    if (!statsManagerEntity) {
      console.error("CombatManager: 'playerStatsManager' property is not assigned on the sysConfiguration component.");
      return;
    }

    // 4. Get the sysPlayerStatsManager component from that entity and call takeDamage.
    const statsManagerComponents = statsManagerEntity.getComponents(sysPlayerStatsManager);
    if (statsManagerComponents && statsManagerComponents.length > 0) {
      const statsManager = statsManagerComponents[0];
      statsManager.takeDamage(player, damage);
    } else {
      console.error("CombatManager: Could not find 'sysPlayerStatsManager' component on the entity provided by sysConfiguration.");
    }
  }
}

Component.register(CombatManager);