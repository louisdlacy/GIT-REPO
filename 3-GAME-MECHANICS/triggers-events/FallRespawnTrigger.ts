import { Component, PropTypes, Player, Entity, NetworkEvent, CodeBlockEvents, SpawnPointGizmo } from 'horizon/core';

/**
 * Network event to broadcast when a player has taken damage.
 * This should match the event definition used by the CombatManager.
 */
export const OnPlayerDamaged = new NetworkEvent<{ player: Player, damage: number }>('OnPlayerDamaged');

/**
 * FallRespawnTrigger
 * A trigger that deals fatal damage to a player and respawns them at a designated point.
 * This is typically used for out-of-bounds or fall zones.
 */
class FallRespawnTrigger extends Component<typeof FallRespawnTrigger> {
  static propsDefinition = {
    // The spawn point entity where the player will be teleported after falling.
    spawnPoint: { type: PropTypes.Entity },
  };

  /**
   * In preStart, we set up the listener for players entering the trigger.
   */
  override preStart() {
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerEnterTrigger,
      (player: Player) => this.handlePlayerEnter(player)
    );
  }

  /**
   * The start method is not needed for this component's logic.
   */
  override start() {
    // No initialization needed in start for this component.
  }

  /**
   * Handles the logic when a player enters the trigger zone.
   * @param player The player who entered the trigger.
   */
  private handlePlayerEnter(player: Player): void {
    console.log(`Player ${player.name.get()} entered the fall respawn trigger.`);

    // Send a damage event to the system to ensure player stats are updated correctly (e.g., a death is recorded).
    // A high damage value ensures the player is defeated.
    this.sendNetworkBroadcastEvent(OnPlayerDamaged, { player: player, damage: 1000 });

    // Check if the spawnPoint prop is assigned before trying to use it.
    if (this.props.spawnPoint) {
      // Teleport the player to the designated spawn point.
      this.props.spawnPoint.as(SpawnPointGizmo).teleportPlayer(player);
    } else {
      console.error("FallRespawnTrigger: 'spawnPoint' property is not assigned. Cannot teleport player.");
    }
  }
}

Component.register(FallRespawnTrigger);