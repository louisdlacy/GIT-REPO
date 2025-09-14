import * as hz from 'horizon/core';

class TeleportPlayerByPlatform extends hz.Component<typeof TeleportPlayerByPlatform> {
  static propsDefinition = {
    vrSpawnPoint: {type: hz.PropTypes.Entity},
    nonVrSpawnPoint: {type: hz.PropTypes.Entity},
  };

  start() {
    // When a player enters the trigger, teleport them to the correct spawn point based on their device type
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (player.deviceType.get() === hz.PlayerDeviceType.VR) {
        this.props.vrSpawnPoint?.as(hz.SpawnPointGizmo)?.teleportPlayer(player);
      } else {
        this.props.nonVrSpawnPoint?.as(hz.SpawnPointGizmo)?.teleportPlayer(player);
      }
    });
  }
}
hz.Component.register(TeleportPlayerByPlatform);
