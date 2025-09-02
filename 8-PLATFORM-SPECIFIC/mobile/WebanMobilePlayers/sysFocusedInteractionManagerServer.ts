import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';

class sysFocusedInteractionManagerServer extends hz.Component<typeof sysFocusedInteractionManagerServer> {
  static propsDefinition = {};

  start() {
    // Send the OnPlayerExitedFocusedInteraction event to the local managers to notify that a player exited Focused Interaction and perform any cleanup code (for example, resetting the player’s camera)
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitedFocusedInteraction, (player: hz.Player) => {
      this.sendNetworkBroadcastEvent(sysEvents.OnPlayerExitedFocusMode, {player: player});
    });
  }
}
hz.Component.register(sysFocusedInteractionManagerServer);
