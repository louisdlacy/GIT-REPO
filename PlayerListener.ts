import * as hz from 'horizon/core';

class PlayerListener extends hz.Component<typeof PlayerListener> {
  static propsDefinition = {};

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
      console.log(`Player ${player.name.get()} has entered the world.`);
    });

  }
}
hz.Component.register(PlayerListener);