import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';
import { sysHintHUDEntity } from 'sysHintHUDEntity';

class sysHintHUDManager extends hz.Component<typeof sysHintHUDManager> {
  static propsDefinition = {};

  private hintHUDEntities = new Array<hz.Entity>();
  private hintHUDComponents = new Array<sysHintHUDEntity>();

  private timeoutID = -1;

  preStart() {
    // Register all hint HUDs to keep track of their entities and components
    this.connectLocalBroadcastEvent(sysEvents.OnRegisterHintHUDEntity, (data) => {
      this.hintHUDEntities.push(data.HUDEntity);
      this.hintHUDComponents.push(data.HUDComponent as sysHintHUDEntity);
    });
  }

  start() {
    // Display the hint HUD of each player when a broadcast event is received
    this.connectNetworkBroadcastEvent(sysEvents.OnDisplayHintHUD, (data) => {
      // Reset timeout
      this.async.clearTimeout(this.timeoutID);

      // Update all hint HUDs texts via their components
      this.hintHUDComponents.forEach(hudComponent => {
        hudComponent.UpdateHintHUDText(data.text);
      });

      // Show the hint HUD of each player
      data.players.forEach(player => {
        // Display a popup instead of the hint HUD for VR players
        if (player.deviceType.get() === hz.PlayerDeviceType.VR) {
          this.world.ui.showPopupForPlayer(player, data.text, data.duration);
        } else {
          let playerIndex = player.index.get();

          // Display the hint HUD
          if (playerIndex < this.hintHUDEntities.length) {
            let playerHintHUDEntity = this.hintHUDEntities[playerIndex];
            playerHintHUDEntity.as(hz.AttachableEntity)?.attachToPlayer(player, hz.AttachablePlayerAnchor.Torso);
            playerHintHUDEntity.setVisibilityForPlayers([player], hz.PlayerVisibilityMode.VisibleTo);
          }

          // Set timeout to hide the hint HUD after a certain amount of time
          this.timeoutID = this.async.setTimeout(() => this.HideHintHUD(), data.duration * 1000);
        }
      });
    });
  }

  // Detach and hide a hint HUD for all players
  private HideHintHUD() {
    let players = this.world.getPlayers();
    players.forEach(player => {
      let playerIndex = player.index.get();
      if (playerIndex < this.hintHUDEntities.length) {
        let playerHintHUDEntity = this.hintHUDEntities[playerIndex];
        playerHintHUDEntity.as(hz.AttachableEntity)?.detach();
        playerHintHUDEntity.setVisibilityForPlayers([], hz.PlayerVisibilityMode.VisibleTo);
      }
    });
  }
}
hz.Component.register(sysHintHUDManager);
