import { CodeBlockEvents, Component, Player, PropTypes, SpawnPointGizmo } from 'horizon/core';

class respawn extends Component<typeof respawn> {
  static propsDefinition = {
    spawnPoint: { type: PropTypes.Entity }
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, this.OnPlayerEnterTrigger.bind(this));
  }

  start() {
    // Initialization logic can go here if needed.
  }

  OnPlayerEnterTrigger(player: Player) {
    if (this.props.spawnPoint) {
      // Teleport the player to the designated spawn point.
      this.props.spawnPoint.as(SpawnPointGizmo)?.teleportPlayer(player);
    } else {
      console.log("Respawn trigger is missing a spawnPoint reference.");
    }
  }
}

Component.register(respawn);