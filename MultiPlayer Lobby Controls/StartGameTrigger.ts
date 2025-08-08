import * as hz from 'horizon/core';
// TODO: import all events from our Utils file

class StartGameTrigger extends hz.Component<typeof StartGameTrigger> {
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
    // TODO: broadcast the "registerNewMatch" event
  }
}
hz.Component.register(StartGameTrigger);
