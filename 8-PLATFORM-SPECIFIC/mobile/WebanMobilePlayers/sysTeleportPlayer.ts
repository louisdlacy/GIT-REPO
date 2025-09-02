import * as hz from 'horizon/core';

class sysTeleportPlayer extends hz.Component<typeof sysTeleportPlayer> {
  static propsDefinition = {
    spawnPoint: {type: hz.PropTypes.Entity},
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.props.spawnPoint?.as(hz.SpawnPointGizmo)?.teleportPlayer(player);
    });
  }
}
hz.Component.register(sysTeleportPlayer);
