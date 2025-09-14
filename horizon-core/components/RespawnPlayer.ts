import { Entity } from 'horizon/core';
import * as hz from 'horizon/core';

/** Respawns/Teleports a player to a destination spawn point gizmo upon entering the trigger */
class RespawnPlayer extends hz.Component<typeof RespawnPlayer> {
  static propsDefinition = {
    destination: { type: hz.PropTypes.Entity }
  };

  destination!: hz.SpawnPointGizmo | undefined;

  preStart(): void {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => this.respawnPlayer(player));
  }

  start() {
    this.destination = this.props.destination?.as(hz.SpawnPointGizmo);
  }

  /** When the player enters the trigger, if there's a spawnpoint entity mapped, respawn them there */
  respawnPlayer(player: hz.Player) {
    this.destination?.teleportPlayer(player);
  }
}
hz.Component.register(RespawnPlayer);