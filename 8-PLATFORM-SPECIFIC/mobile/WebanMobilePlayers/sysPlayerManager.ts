import * as hz from 'horizon/core';

class sysPlayerManager extends hz.Component<typeof sysPlayerManager> {
  static propsDefinition = {};

  private cameraManagers: hz.Entity[] = [];
  private focusedInteractionManagers: hz.Entity[] = [];

  preStart() {
    // Get all camera managers
    this.cameraManagers = this.world.getEntitiesWithTags(["CameraManager"]);
    // Get all Focused Interaction managers
    this.focusedInteractionManagers = this.world.getEntitiesWithTags(["FIManager"]);
  }

  start() {
    // When a player enters the world assign them a Camera Manager and a Focused Interaction Manager
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      this.RegisterPlayer(player);
    });

    // When a player exits the world release their Camera Manager and Focused Interaction Manager
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player: hz.Player) => {
      this.DeregisterPlayer(player);
    });
  }

  private RegisterPlayer(player: hz.Player) {
    let playerIndex = player.index.get();

    // Assign a Camera Manager to the player
    if (playerIndex < this.cameraManagers.length) {
      this.cameraManagers[playerIndex].owner.set(player);
    } else {
      console.error("Not enough Camera managers in the world");
    }

    // Assign a Focused Interaction Manager to the player
    if (playerIndex < this.focusedInteractionManagers.length) {
      this.focusedInteractionManagers[playerIndex].owner.set(player);
    } else {
      console.error("Not enough Focused Interaction managers in the world");
    }
  }

  private DeregisterPlayer(player: hz.Player) {
    let playerIndex = player.index.get();

    // Release the Camera Manager from the player
    if (playerIndex < this.cameraManagers.length) {
      this.cameraManagers[playerIndex].owner.set(this.world.getServerPlayer());
    }

    // Release the Focused Interaction Manager from the player
    if (playerIndex < this.focusedInteractionManagers.length) {
      this.focusedInteractionManagers[playerIndex].owner.set(this.world.getServerPlayer());
    }
  }
}
hz.Component.register(sysPlayerManager);
