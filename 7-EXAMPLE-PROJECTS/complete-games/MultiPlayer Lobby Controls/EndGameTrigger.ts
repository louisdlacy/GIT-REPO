import * as hz from 'horizon/core';
import Events from 'GameUtils';

class ReturnToLobbyTrigger extends hz.Component<typeof ReturnToLobbyTrigger> {
  static propsDefinition = {};

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterTrigger,
      (player: hz.Player) => {
        this.handleOnPlayerEnter(player);
      }
    );
  }

  private handleOnPlayerEnter(player: hz.Player): void {
    // TODO: broadcast the "gameOver" event
  }
}
hz.Component.register(ReturnToLobbyTrigger);
